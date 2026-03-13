function Todos({ todos }) {
    console.log(todos);
    if (!todos) {
        return <div>Loading...</div>
    }
    return (
        <div>
            {todos.map((todo, index) => (
                <div key={index}>
                    <h1>{todo.title}</h1>
                    <h2>{todo.description}</h2>
                    <button>
                        {todo.completed ? "Completed" : "Mark as Complete"}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Todos