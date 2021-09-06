// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Functions
function addTodo(event) {
    // Prevent form from submitting
    event.preventDefault();
    // Create a Todo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    // Create li
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');

    todoDiv.appendChild(newTodo);
    // Add todo to localstorage
    savelocalTodos(todoInput.value);
    // Checkmark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add('completed-btn');
    todoDiv.appendChild(completedButton);
    // Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    // Append to Todo List
    todoList.appendChild(todoDiv);
    // Clear Todo Input value
    todoInput.value = '';
}

function deleteCheck(event) {
    const clickedItem = event.target;
    // Delete Todo
    if (clickedItem.classList[0] === 'trash-btn') {
        const todo = clickedItem.parentElement;
        todo.classList.add('fall');
        removeTodos(todo);
        todo.addEventListener('transitionend', function () {
            todo.remove();
        });
    }

    // Check mark
    if (clickedItem.classList[0] === 'completed-btn') {
        clickedItem.parentElement.classList.toggle('completed');
    }
}


function filterTodo(event) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {

        switch (event.target.value) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

function savelocalTodos(todo) {
    // Do I already have sth on my local storage?
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(todo) {
    // Do I already have sth on my local storage?
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo){
        // Create a Todo div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        // Create li
        const newTodo = document.createElement('li');
        newTodo.innerText = todo;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        // Checkmark button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>'
        completedButton.classList.add('completed-btn');
        todoDiv.appendChild(completedButton);
        // Trash button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>'
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        // Append to Todo List
        todoList.appendChild(todoDiv);
    });
}

function removeTodos(todo) {
    // Do I already have sth on my local storage?
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    let toBeRemoved = todo.children[0].innerText;
    todos.splice(todos.indexOf(toBeRemoved), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}


// Event Listner
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

document.addEventListener('DOMContentLoaded', getTodos);