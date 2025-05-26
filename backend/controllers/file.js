import fs from 'fs';
import path from 'path';
import multer from 'multer';
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
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
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

export const uploadFile = (req, res) => {
	console.log(req);
  upload.single("file")(req, res, function (err) {
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

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      message: "圖片上傳成功",
      filename: req.file.filename,
      url: fileUrl
    });
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
			return res.sendFile(filePaths);
    }
    
		res.sendFile(filePath);
  });
};

