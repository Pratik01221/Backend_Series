const z = require("zod");

const createTodo = z.object({
    title: z.string(),
    description: z.string(),
})

const updateTodo = z.object({
    id: z.number(),
})

module.exports = {
    createTodo,
    updateTodo
}
