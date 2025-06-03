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

// Get all delivered cart items with grades and feedback
export const getDeliveredCartItems = (result) => {
  const query = `
    SELECT c.*, f.food_name, f.food_price, f.food_discount, f.food_src, u.user_name 
    FROM cart c 
    JOIN food f ON c.food_id = f.food_id 
    JOIN user u ON c.user_id = u.user_id 
    WHERE c.delivered = true 
    ORDER BY c.cart_id DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// Get or create bot user
const getOrCreateBotUser = async () => {
  try {
    // Try to find existing bot user
    const [users] = await db.promise().query(
      "SELECT user_id FROM user WHERE user_name = ?",
      ["AutoGenOrderBot"]
    );

    if (users.length > 0) {
      return users[0].user_id;
    }

    // If bot user doesn't exist, create it
    const botUser = {
      user_name: "AutoGenOrderBot",
      user_email: "bot@restaurant.com",
      user_phone: "000-000-0000",
      user_password: "bot123",
      user_birth: "2024-01-01",
      user_gender: "other"
    };

    const [result] = await db.promise().query("INSERT INTO user SET ?", botUser);
    return result.insertId;
  } catch (error) {
    console.error('Error getting/creating bot user:', error);
    throw error;
  }
};

// Get count of undelivered items
export const getUndeliveredItemsCount = async () => {
  try {
    const [results] = await db.promise().query(
      "SELECT COUNT(*) as count FROM cart WHERE delivered = false"
    );
    return results[0].count;
  } catch (error) {
    console.error('Error counting undelivered items:', error);
    throw error;
  }
};

// Get food IDs from undelivered orders
const getUndeliveredFoodIds = async (userId) => {
  try {
    const [results] = await db.promise().query(
      "SELECT DISTINCT food_id FROM cart WHERE user_id = ? AND delivered = false",
      [userId]
    );
    return results.map(row => row.food_id);
  } catch (error) {
    console.error('Error getting undelivered food IDs:', error);
    throw error;
  }
};

// Generate random cart item
export const generateRandomCartItem = async () => {
  try {
    // Check undelivered items count
    const undeliveredCount = await getUndeliveredItemsCount();
    if (undeliveredCount >= 5) {
      console.log('Skipping generation: 5 or more undelivered items exist');
      return null;
    }

    // Get bot user_id
    const botUserId = await getOrCreateBotUser();

    // Get food IDs that are already in undelivered orders
    const undeliveredFoodIds = await getUndeliveredFoodIds(botUserId);
    
    // Get random food_id that's not in undelivered orders
    const [foods] = await db.promise().query(
      "SELECT food_id FROM food WHERE food_id NOT IN (?) ORDER BY RAND() LIMIT 1",
      [undeliveredFoodIds.length > 0 ? undeliveredFoodIds : [0]] // Use [0] when no undelivered items to avoid SQL error
    );
    
    if (foods.length === 0) {
      console.log('No new foods available to order');
      return null;
    }
    
    // Get random table_id
    const [tables] = await db.promise().query("SELECT table_id FROM tables ORDER BY RAND() LIMIT 1");
    if (tables.length === 0) return null;

    const randomQty = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
    
    const cartItem = {
      user_id: botUserId,
      food_id: foods[0].food_id,
      item_qty: randomQty,
      table_id: tables[0].table_id,
      delivered: false
    };

    // Insert the random cart item
    const [result] = await db.promise().query("INSERT INTO cart SET ?", cartItem);
    console.log(`Generated new order for food_id ${foods[0].food_id} (not in undelivered list: ${undeliveredFoodIds.join(', ')})`);
    return result.insertId;
  } catch (error) {
    console.error('Error generating random cart item:', error);
    return null;
  }
};

// Update auto_grade for a specific order
export const updateAutoGrade = (userId, foodId, tableId, autoGrade, result) => {
  db.query(
    "UPDATE cart SET auto_grade = ? WHERE user_id = ? AND food_id = ? AND table_id = ?",
    [autoGrade, userId, foodId, tableId],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        if (results.affectedRows === 0) {
          result({ message: "Order not found" }, null);
        } else {
          result(null, {
            message: "Auto grade updated successfully",
            affectedRows: results.affectedRows
          });
        }
      }
    }
  );
};
