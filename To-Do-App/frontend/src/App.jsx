import { useState, useEffect } from "react";
import Todos from "./Components/Todos";
import CreateTodo from "./Components/CreateTodo";

function App() {
  const [todos, setTodos] = useState();

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();
      setTodos(data.todos);
    }
    fetchTodos();

  }, [])


  // const todos = [
  //   {
  //     title: "First Todo",
  //     description: "First todo description",
  //     completed: false
  //   },
  //   {
  //     title: "Second Todo",
  //     description: "Second todo description",
  //     completed: true
  //   }
  // ];

  return (
    <div>
      <CreateTodo />
      <Todos todos={todos} />
    </div>
  );
}

export default App;