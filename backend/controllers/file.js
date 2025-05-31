import fs from 'fs';
import path from 'path';
import multer from 'multer';
import db from "../config/database.js";

const __dirname = import.meta.dirname;

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Initially save with a temporary name to ensure no conflicts
    const ext = path.extname(file.originalname);
    const uniqueName = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("只允許上傳圖片類型 (jpeg, png, gif)"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Helper function to validate IDs exist in database
const validateIds = async (user_id, food_id, table_id) => {
  try {
    // Check user exists
    const [userRows] = await db.promise().query("SELECT user_id FROM user WHERE user_id = ?", [user_id]);
    if (userRows.length === 0) {
      throw new Error("User ID does not exist");
    }

    // Check food exists  
    const [foodRows] = await db.promise().query("SELECT food_id FROM food WHERE food_id = ?", [food_id]);
    if (foodRows.length === 0) {
      throw new Error("Food ID does not exist");
    }

    // Check table exists
    const [tableRows] = await db.promise().query("SELECT table_id FROM tables WHERE table_id = ?", [table_id]);
    if (tableRows.length === 0) {
      throw new Error("Table ID does not exist");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = (req, res) => {
  // Create a multer single file upload middleware
  const uploadMiddleware = upload.single("file");

  // Handle the upload
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer 錯誤1：" + err.message);
      return res.status(400).json({ error: "Multer 錯誤：" + err.message });
    } else if (err) {
      console.error("Multer 錯誤2：" + err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.log("upload with 400, 請選擇一張圖片上傳");
      return res.status(400).json({ error: "請選擇一張圖片上傳" });
    }

    try {
      // Extract IDs from filename (assuming format: order_userId_foodId_tableId)
      if (req.body.filename) {
        const parts = req.body.filename.split('_');
        if (parts.length >= 4) {
          const food_id = parseInt(parts[1]);
          const user_id = parseInt(parts[2]);
          const table_id = parseInt(parts[3].split('.')[0]); // Remove file extension

          // Validate IDs exist
          await validateIds(user_id, food_id, table_id);

          // Update cart delivered status
          await db.promise().query(
            "UPDATE cart SET delivered = true WHERE user_id = ? AND food_id = ? AND table_id = ?",
            [user_id, food_id, table_id]
          );
        }
      }

      // Now we can access form fields after multer has processed them
      console.log("Form fields:", req.body);
      
      // If a custom filename was provided, rename the file
      if (req.body.filename) {
        const oldPath = path.join(uploadDir, req.file.filename);
        const ext = path.extname(req.file.originalname);
        
        // Remove any existing extension from the custom filename
        const customFilename = req.body.filename.replace(/\.[^/.]+$/, "");
        const newFilename = `${customFilename}${ext}`;
        const newPath = path.join(uploadDir, newFilename);
        
        // Check if file with same name exists
        if (fs.existsSync(newPath)) {
          // If file exists, delete it before renaming
          fs.unlinkSync(newPath);
        }
        
        fs.renameSync(oldPath, newPath);
        req.file.filename = newFilename;
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return res.status(200).json({
        message: "圖片上傳成功",
        originalFilename: req.body.filename || req.file.originalname,
        serverFilename: req.file.filename,
        url: fileUrl
      });
    } catch (error) {
      // Delete the uploaded file if validation fails
      console.log("failed to upload file", error);
      if (req.file) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      }
      return res.status(400).json({ error: error.message });
    }
  });
};

export const downloadFile = (req, res) => {
  const filename = req.params.filename;
  
  const filePath = path.join(uploadDir, filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`檔案不存在：${filePath}`);
			const filenames = "default.png";
			const filePaths = path.join(uploadDir, filenames);
      //return res.status(404).json({ error: "檔案不存在" });
			console.log("qq", filePaths);
			return res.status(404).sendFile(filePaths);
    }
    
		res.sendFile(filePath);
  });
};

