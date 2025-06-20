// import express
import express from "express";
// import functions from controller
import {
  showFoods,
  showFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.js";

import { uploadFile, downloadFile } from "../controllers/file.js";

import { showAUser, createAccount } from "../controllers/user.js";

import {
  addItems,
  getItem,
  updateItem,
  allItems,
  deleteItem,
  deleteItems,
	allCartItems,
  getDeliveredItems,
  toggleAutoGenerate,
  updateOrderAutoGrade,
} from "../controllers/cart.js";

import { createBooking } from "../controllers/booktable.js";

import {
  createBillDetails,
  getBillDetailsById,
} from "../controllers/billdetails.js";

import {
  showNewestStatusId,
  createBillStatus,
  getAllBillsByUser,
  getAllBillsByBill,
  getAllBills,
  updateBillStatus,
  updateBillPaid,
  cancelBillStatus,
} from "../controllers/billstatus.js";

import { updateGrade } from "../controllers/grade.js";

import { authMiddleware } from '../middlewares/auth.js';
import { cartItemLimiter } from '../middlewares/rateLimiter.js';

// init express router
const router = express.Router();

////////////////////////// FOOD ////////////////////////////////
// get all Food
router.get("/api/foods", showFoods);

// get single Food
router.get("/api/foods/:id", showFoodById);

// create Food
router.post("/api/foods", createFood);

// update Food
router.put("/api/foods/:id", updateFood);

// delete Food
router.delete("/api/foods/:id", deleteFood);

////////////////////////// USER ////////////////////////////////
// get all user
router.get("/api/users/:email", showAUser);

// create account
router.post("/api/users/", createAccount);

////////////////////////// CART ////////////////////////////////
// add to cart
router.post("/api/cartItem", cartItemLimiter, addItems);

// get a item in cart
router.get("/api/cartItem/:user_name/:food_id", getItem);

// get all items by user id
router.get("/api/cartItem/:user_name", allItems);

router.get("/api/cartItem", authMiddleware, allCartItems);

// update item qty
router.put("/api/cartItem/", authMiddleware, updateItem);

// update auto grade
router.put("/api/cartItem/auto-grade", updateOrderAutoGrade);

// delete a item in cart
router.delete("/api/cartItem/:user_id/:food_id", authMiddleware, deleteItem);

// delete all items in cart
router.delete("/api/cartItem/:id", deleteItems);

// get all delivered cart items
router.get("/api/delivered-items", getDeliveredItems);

// toggle auto-generation of cart items
router.post("/api/cart/auto-generate", toggleAutoGenerate);

////////////////////////// Booking ////////////////////////////////
router.post("/api/booking", createBooking);

////////////////////////// Bill Details ////////////////////////////////
router.post("/api/billdetails", createBillDetails);
router.get("/api/billdetails/:id", getBillDetailsById);

////////////////////////// Bill Status ////////////////////////////////
router.get("/api/billstatus/new", showNewestStatusId);
router.post("/api/billstatus", createBillStatus);
router.get("/api/billstatus/user/:id", getAllBillsByUser);
router.get("/api/billstatus/bill/:id", getAllBillsByBill);
router.get("/api/billstatus", getAllBills);
router.put("/api/billstatus/:id", updateBillStatus);
router.put("/api/billstatus/paid/:id", updateBillPaid);
router.put("/api/billstatus/cancel/:id", cancelBillStatus);
router.post("/api/upload", uploadFile); 
router.get("/api/download/:filename", downloadFile);

////////////////////////// Grade ////////////////////////////////
router.post("/api/grade", updateGrade);

// export default router
export default router;
