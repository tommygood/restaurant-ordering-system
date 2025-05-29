// import connection
import db from "../config/database.js";

// update order grade
export const updateOrderGrade = (data, result) => {
    db.query(
        "UPDATE cart SET grade = ?, feedback = ? WHERE user_id = ? AND food_id = ? AND table_id = ?",
        [data.grade, data.description, data.user_id, data.food_id, data.table_id],
        (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results);
            }
        }
    );
}; 