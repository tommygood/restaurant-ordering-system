// import functions from User model

import {
  getAllItems,
  getAItem,
  insertToCart,
  updateCartItemQty,
  deleteItemInCart,
  deleteAllItemsByUser,
  getUserId,
} from "../models/CartModel.js";

// get all Items
export const allItems = (req, res) => {
  getUserId({ user_name: req.params.user_name }, (err, user_id_results) => {
    getAllItems(user_id_results, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        console.log(`TT ${results}, ${JSON.stringify(results)}`);
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
    data.user_id = results;
    delete data.user_name;
    insertToCart(data, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
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
