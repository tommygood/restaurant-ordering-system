// import functions from User model
import db from "../config/database.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  getAllItems,
  getAItem,
  insertToCart,
  updateCartItemQty,
  deleteItemInCart,
  deleteAllItemsByUser,
  getUserId,
	getAllCartItems,
  getDeliveredCartItems,
  generateRandomCartItem,
  updateAutoGrade,
} from "../models/CartModel.js";

// Global variable to store the interval ID
let autoGenerateInterval = null;
let autoStopTimeout = null;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

// get all Items
export const allCartItems = (req, res) => {
    // Check if delivered header exists and is false
    const showUndelivered = req.headers.delivered === 'false';
    console.log(`PP ${showUndelivered}, ${JSON.stringify(req.headers)}`);
    
    // Use different query based on delivered header
    const query = showUndelivered 
      ? "SELECT * FROM cart WHERE delivered != true AND item_qty > 0"
      : "SELECT * FROM cart WHERE item_qty > 0";

    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Failed to get cart items",
          error: err
        });
      } else {
        console.log(`TT ${results}, ${JSON.stringify(results)}`);
        res.json(results);
      }
    });
};

// get all Items
export const allItems = (req, res) => {
  getUserId({ user_name: req.params.user_name }, (err, user_id_results) => {
    getAllItems(user_id_results, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  });
};

// get a Item
export const getItem = (req, res) => {
  console.log(`PP ${req.params.user_name}`);
  getUserId(req.params.user_name, (err, user_id_results) => {
    const user_id = user_id_results;
    const food_id = req.params.food_id;
    console.log(`QQ ${user_id}, ${food_id}`);
    getAItem(user_id, food_id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  });
};

// add to cart
export const addItems = (req, res) => {
  let data = req.body;
  // put the user id into the data
  getUserId(data, (err, results) => {
    if (err) {
      res.status(500).json({
        status: false,
        message: "Failed to get user ID",
        error: err
      });
      return;
    }
    
    data.user_id = results;
    delete data.user_name;
    
    insertToCart(data, (err, results) => {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Failed to add item to cart",
          error: err
        });
      } else {
        res.status(200).json({
          status: true,
          message: results.message || "Item added to cart",
          data: results
        });
      }
    });
  });
};

// update Item
export const updateItem = (req, res) => {
  const data = req.body;
  updateCartItemQty(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// delete a item in cart
export const deleteItem = (req, res) => {
  const user_id = req.params.user_id;
  const food_id = req.params.food_id;
  deleteItemInCart(user_id, food_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// delete all items in cart
export const deleteItems = (req, res) => {
  deleteAllItemsByUser(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get all delivered cart items
export const getDeliveredItems = (req, res) => {
  getDeliveredCartItems((err, results) => {
    if (err) {
      res.status(500).json({
        status: false,
        message: "Failed to get delivered items",
        error: err
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Successfully retrieved delivered items",
        data: results
      });
    }
  });
};

// Delete all cart items
const deleteAllCartItems = async () => {
  try {
    // Delete all cart items from database
    await db.promise().query("DELETE FROM cart");

    // Delete all files in uploads directory except default.png
    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
      if (file !== 'default.png') {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      }
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAllCartItems:', error);
    throw error;
  }
};

// Start/Stop auto-generating cart items
export const toggleAutoGenerate = async (req, res) => {
  try {
    // Clear existing interval and timeout if they exist
    if (autoGenerateInterval) {
      clearInterval(autoGenerateInterval);
      autoGenerateInterval = null;
    }
    if (autoStopTimeout) {
      clearTimeout(autoStopTimeout);
      autoStopTimeout = null;
    }

    // Delete all cart items first
    await deleteAllCartItems();

    // Start new interval
    autoGenerateInterval = setInterval(async () => {
      try {
        // Random interval between 5-8 seconds
        const randomInterval = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        const result = await generateRandomCartItem();
        
        // Only set new interval if item was generated (less than 5 undelivered items)
        if (result !== null) {
          // Clear and set new interval with random duration
          clearInterval(autoGenerateInterval);
          autoGenerateInterval = setInterval(async () => {
            await generateRandomCartItem();
          }, randomInterval);
        }
      } catch (error) {
        console.error('Error in auto-generate interval:', error);
      }
    }, 5000); // Initial delay of 5 seconds

    // Set auto-stop timeout for 5 minutes
    autoStopTimeout = setTimeout(() => {
      if (autoGenerateInterval) {
        clearInterval(autoGenerateInterval);
        autoGenerateInterval = null;
        console.log('Auto-generation stopped after 5 minutes');
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    res.json({ 
      status: true,
      message: "Cart items cleared and auto-generation restarted (will stop after 5 minutes, max 5 undelivered items)" 
    });
  } catch (error) {
    console.error('Error in auto-generate:', error);
    res.status(500).json({
      status: false,
      message: "Failed to handle auto-generate",
      error: error.message
    });
  }
};

// Update auto_grade for a specific order
export const updateOrderAutoGrade = (req, res) => {
  const foodId = req.headers['food-id'];
  const userId = req.headers['user-id'];
  const tableId = req.headers['table-id'];
  const auto_grade = req.headers['auto-grade'];

  // Validate required headers
  if (!foodId || !userId || !tableId) {
    return res.status(400).json({
      status: false,
      message: "Missing required headers: food-id, user-id, and table-id are required"
    });
  }

  if (auto_grade === undefined) {
    return res.status(400).json({
      status: false,
      message: "auto_grade is required in request body"
    });
  }

  updateAutoGrade(userId, foodId, tableId, auto_grade, (err, results) => {
    if (err) {
      res.status(500).json({
        status: false,
        message: "Failed to update auto grade",
        error: err
      });
    } else {
      res.status(200).json({
        status: true,
        message: results.message,
        data: results
      });
    }
  });
};
