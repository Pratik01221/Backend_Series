const {z}= require("zod")

const BookValidation = z.object({
    id: z.number().min(1).max(2),
    title: z.string().min(2),
    author: z.string().optional(),
    price: z.number().optional(),
    publishedyear: z.number().optional()
});

module.exports = { BookValidation };