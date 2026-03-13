import { useState } from "react";
function CreateTodo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    return (
        <div>
            <input id="title" style={{ padding: 10, margin: 10 }} type="text" placeholder="Title"
                onChange={function (e) {
                    const value = e.target.value;
                    setTitle(value);
                }} /> <input /> <br />
            <input id="description" style={{ padding: 10, margin: 10 }} type="text" placeholder="Description"
                onChange={function (e) {
                    const value = e.target.value;
                    setDescription(value);
                }} /> <br />
            <button style={{ padding: 10, margin: 10 }} onClick={function () {
                fetch("http://localhost:3000/todo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        completed: false
                    })
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }}> Create Todo
            </button>
        </div>
    )
}

export default CreateTodo   