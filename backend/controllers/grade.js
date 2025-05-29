// Import function from Grade Model
import { updateOrderGrade } from "../models/GradeModel.js";

// Update order grade
export const updateGrade = (req, res) => {
    const data = req.body;
    updateOrderGrade(data, (err, results) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: "Failed to update grade",
                error: err
            });
        } else {
            res.status(200).send({
                status: true,
                message: "Grade updated successfully"
            });
        }
    });
}; 