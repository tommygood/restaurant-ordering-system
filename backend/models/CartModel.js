// import connection
import db from "../config/database.js";

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
  db.query("INSERT INTO cart SET ?", data, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
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
