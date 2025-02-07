const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

addTaskButton.addEventListener("click", function () {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: taskText }),
  })
  .then(response => response.json())
  .then(() => {
    renderTasks();
    taskInput.value = "";
  })
  .catch(error => console.error('Помилка при додаванні завдання:', error));
});

function renderTasks() {
  fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(tasks => {
          taskList.innerHTML = ""; 

          tasks.forEach((task) => {
              const li = document.createElement("li");

              const span = document.createElement("span");
              span.textContent = task.text;

              const readyButton = document.createElement("button");
              readyButton.textContent = task.completed ? "Виконано" : "Готово!";
              readyButton.classList.add("ready");

              if (task.completed) {
                  li.classList.add("completed"); 
                  readyButton.disabled = true;   
              }

              readyButton.addEventListener("click", () => markAsReady(task));

              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Видалити";
              deleteButton.classList.add("delete"); 
              deleteButton.addEventListener("click", () => deleteTask(task.id));

              li.appendChild(span);
              li.appendChild(readyButton);
              li.appendChild(deleteButton);
              taskList.appendChild(li);
          });
      })
      .catch(error => console.error('Помилка при завантаженні завдань:', error));
}


function markAsReady(task) {
  fetch(`http://localhost:3001/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  })
  .then(response => response.json())
  .then(() => renderTasks()) 
  .catch(error => console.error("Помилка при оновленні завдання:", error));
}

function deleteTask(taskId) {
  fetch(`http://localhost:3001/tasks/${taskId}`, {
    method: 'DELETE',
  })
  .then(() => renderTasks())
  .catch(error => console.error('Помилка при видаленні завдання:', error));
}

function loadTasks() {
  renderTasks();
}

document.addEventListener("DOMContentLoaded", loadTasks);
