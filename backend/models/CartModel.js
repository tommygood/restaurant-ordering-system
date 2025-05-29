// import connection
import db from "../config/database.js";


export const getAllCartItems = (result) => {
  db.query("SELECT * FROM cart WHERE item_qty > 0", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};


// get all items by user id
export const getAllItems = (id, result) => {
  db.query("SELECT * FROM cart WHERE user_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// get the user id by username or create a user and get it's id if the username not exist
export const getUserId = (username, result) => {
  db.query(
    "SELECT user_id FROM user WHERE user_name = ?",
    [username.user_name],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        if (results.length > 0) {
          result(null, results[0].user_id);
        } else {
          db.query(
            //"INSERT INTO user (user_name) VALUES (?) SELECT * WHERE NOT EXISTS (  SELECT 1 FROM user WHERE user_name = ?);",
            "INSERT INTO user (user_name) VALUES (?);",
            [username.user_name, username.user_name],
            (err, results) => {
              if (err) {
                console.log(err);
                result(err, null);
              } else {
                result(null, results.insertId);
              }
            },
          );
        }
      }
    },
  );
};

// get a items by user id, food id
export const getAItem = (user, food, result) => {
  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND food_id = ?",
    [user, food],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    },
  );
};

// insert new item to cart
export const insertToCart = (data, result) => {
  // First check if the item already exists
  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND food_id = ?",
    [data.user_id, data.food_id],
    (err, existingItems) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        if (existingItems.length > 0) {
          // If item exists, update the quantity
          const newQty = existingItems[0].item_qty + (data.item_qty || 1);
          db.query(
            "UPDATE cart SET item_qty = ? WHERE user_id = ? AND food_id = ?",
            [newQty, data.user_id, data.food_id],
            (err, results) => {
              if (err) {
                console.log(err);
                result(err, null);
              } else {
                result(null, { ...results, message: "Updated existing item quantity" });
              }
            }
          );
        } else {
          // If item doesn't exist, insert new
          db.query("INSERT INTO cart SET ?", data, (err, results) => {
            if (err) {
              console.log(err);
              result(err, null);
            } else {
              result(null, { ...results, message: "Added new item to cart" });
            }
          });
        }
      }
    }
  );
};

// update qty of a cart item
export const updateCartItemQty = (data, result) => {
  db.query(
    "UPDATE cart SET item_qty = ? WHERE user_id = ? AND food_id = ?",
    [data.item_qty, data.user_id, data.food_id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    },
  );
};

// delete cart item
export const deleteItemInCart = (user, food, result) => {
  db.query(
    "DELETE FROM cart WHERE user_id = ? AND food_id = ?",
    [user, food],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    },
  );
};

// delete all Items
export const deleteAllItemsByUser = (id, result) => {
  db.query("DELETE FROM cart WHERE user_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};
