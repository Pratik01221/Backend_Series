Apply following validations for API created in Practical Assignment3

Student Data
id- required, unique

name- Required, must be at least 3 characters

age- Required, Must be a number between 18 and 30

course- Required, Must be either "FY MCA", "SY MCA", “FY MBA” or "SY MBA"

email- Required, Valid email id having minimum two domain segments

 

Book Data
id- required, unique

title- Required, must be at least 4 characters, at most 20 characters

author- Required, must be at least 4 characters, at most 15 characters

price- Required, must be a number

publishedyear- Required, must be between 2000 to 2026

 

Upload Zip file

const {z}= require("zod")

const BookValidation = z.object({
    id: z.number().min(1).max(2),
    title: z.string().min(2),
    author: z.string().optional(),
    price: z.number().optional(),
    publishedyear: z.number().optional()
});

module.exports = { BookValidation };