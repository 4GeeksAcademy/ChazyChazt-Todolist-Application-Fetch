import React, { useState, useEffect } from "react";

const Home = () => {
	const [taskList, setTaskList] = useState([])
	const [inputTask, setInputTask] = useState({
		"label": "",
		"is_done": false
	});

	async function getInfoTask() {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/J-LopezE");
			const infoData = await response.json();
			console.log(infoData)
			if (response.ok) {
				setTaskList(infoData.todos);
			} else if (response.status == 404) {
				createUser()
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function createUser() {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/J-LopezE", {
				method: "POST",
				headers: {
					'Content-type': 'application/json'
				}
			});
			if (response.ok) {
				getInfoTask();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function createTask() {
		const response = await fetch("https://playground.4geeks.com/todo/todos/J-LopezE", {
			method: "POST",
			body: JSON.stringify(inputTask),
			headers: {
				'Content-type': 'application/json'
			}
		})
		if (response.ok) {
			const postData = await response.json();
			console.log();
			// getInfoTask(); opción pero no tan recomendado
			setTaskList([...taskList, postData])
		} else {
			alert("No se pudo crear")
		}
	}

	const taskData = (event) => {
		setInputTask({ ...inputTask, [event.target.name]: event.target.value });
	}
	const evenKey = (event) => {
		if (event.key === "Enter")
			return createTask();
	
	}

	async function deletTask(id) {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error("No se puede borrar la tarea");
			}
			const filterTask = taskList.filter((taskelement) => taskelement.id !== id)
			setTaskList(filterTask);
		} catch (error) {
			console.log(error);
		}
	}

	async function deletAll() {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/J-LopezE`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error("No se puede borrar el usuario");
			}
			createUser()
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		getInfoTask();
	}, []);

	return (
		<div className="container">
		<div className="card mb-3 mt-5 text-center">
			<h1>TodoList React y Fetch</h1>
			<div className="card-header d-flex">
				<input
					type="text"
					name="label"
					placeholder="Ingrese nueva tarea y presione Enter"
					className="form-control"
					value={inputTask.label}
					onChange={taskData}
					onKeyDown={(event) => evenKey(event)}
				/>

			</div>
			<div className="card-body">
				<ul className="list-group">
					{taskList.map((taskelement) =>
					(
						<li
							key={taskelement.id}
							className="list-group-item active d-flex justify-content-between" aria-current="true">
							{taskelement.label}
							<button className="btn btn-danger" onClick={() => deletTask(taskelement.id)} >X</button>

						</li>
					))}
				</ul>
				<button className="btn btn-danger" onClick={() => deletAll()}>Eliminar todos</button>
			</div>
		</div>
		</div>
	);
};

export default Home;
