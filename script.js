document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const undoneTaskList = document.getElementById('undone-task-list');
    const doneTaskList = document.getElementById('done-task-list');

    // Load tasks from local storage
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                text: taskText,
                done: false
            };
            createTaskElement(task);
            saveTask(task);
            taskInput.value = '';
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', deleteTask);

        li.textContent = task.text;
        li.appendChild(deleteButton);
        li.addEventListener('click', toggleComplete);

        if (task.done) {
            li.classList.add('complete');
            doneTaskList.appendChild(li);
        } else {
            undoneTaskList.appendChild(li);
        }
    }

    function deleteTask(e) {
        const li = e.target.parentElement;
        removeTaskFromStorage(li.textContent.slice(0, -6)); // Remove 'Delete' text
        li.parentElement.removeChild(li);
    }

    function toggleComplete(e) {
        if (e.target.tagName === 'LI') {
            const li = e.target;
            li.classList.toggle('complete');
            const taskText = li.textContent.slice(0, -6); // Remove 'Delete' text
            updateTaskStatus(taskText, li.classList.contains('complete'));
            if (li.classList.contains('complete')) {
                doneTaskList.appendChild(li);
            } else {
                undoneTaskList.appendChild(li);
            }
        }
    }

    function saveTask(task) {
        const tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function removeTaskFromStorage(taskText) {
        const tasks = getTasksFromStorage();
        const filteredTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }

    function updateTaskStatus(taskText, done) {
        const tasks = getTasksFromStorage();
        const task = tasks.find(task => task.text === taskText);
        if (task) {
            task.done = done;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }
});
