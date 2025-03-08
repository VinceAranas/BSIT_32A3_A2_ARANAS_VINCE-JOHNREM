document.addEventListener('DOMContentLoaded', () => {
    const taskField = document.getElementById('taskInput');
    const btnAddTask = document.getElementById('addTaskButton');
    const tasksContainer = document.getElementById('taskList');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const sortButton = document.getElementById('sortButton');
    
    loadTasks();

    btnAddTask.addEventListener('click', createTask);
    taskField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTask();
        }
    });

    sortButton.addEventListener('click', sortTasks);

    function createTask() {
        const taskText = taskField.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (!taskText || !dueDate) {
            showMessage("Please fill in both the task and the due date.");
            return;
        }

        const listItem = document.createElement('li');
        listItem.className = `list-group-item d-flex justify-content-between align-items-center ${priority}-priority`;
        listItem.dataset.priority = priority;
        listItem.innerHTML = `
            <span>${taskText} (Due: ${dueDate})</span>
            <div>
                <button class="btn btn-sm btn-success done-button">Done</button>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
            </div>
        `;

        if (isOverdue(dueDate)) {
            listItem.classList.add('overdue');
        }

        tasksContainer.appendChild(listItem);
        taskField.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'low';

        saveTasks();
    }

    function isOverdue(date) {
        return new Date(date) < new Date();
    }

    function showMessage(message, type = 'danger') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }

    tasksContainer.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (!listItem) return;

        if (e.target.classList.contains('delete-button')) {
            listItem.remove();
            saveTasks();
        }
        if (e.target.classList.contains('done-button')) {
            listItem.classList.toggle('list-group-item-success');
            saveTasks();
        }
        if (e.target.classList.contains('edit-button')) {
            const taskText = listItem.querySelector('span').textContent.split(" (Due: ")[0];
            const dueDate = listItem.querySelector('span').textContent.split(" (Due: ")[1].replace(')', '');
            taskField.value = taskText;
            dueDateInput.value = dueDate;
            listItem.remove();
            saveTasks();
        }
    });

    function saveTasks() {
        const tasks = [];
        tasksContainer.querySelectorAll('li').forEach(item => {
            const taskText = item.querySelector('span').textContent.split(" (Due: ")[0];
            const dueDate = item.querySelector('span').textContent.split(" (Due: ")[1].replace(')', '');
            const priority = item.dataset.priority;
            const done = item.classList.contains('list-group-item-success');
            tasks.push({ taskText, dueDate, priority, done });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${task.priority}-priority`;
            listItem.dataset.priority = task.priority;
            listItem.innerHTML = `
                <span>${task.taskText} (Due: ${task.dueDate})</span>
                <div>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                </div>
            `;

            if (isOverdue(task.dueDate)) {
                listItem.classList.add('overdue');
            }
            if (task.done) {
                listItem.classList.add('list-group-item-success');
            }
            tasksContainer.appendChild(listItem);
        });
    }

    function sortTasks() {
        const tasks = Array.from(tasksContainer.children);
        tasks.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority];
        });
        tasksContainer.innerHTML = '';
        tasks.forEach(task => tasksContainer.appendChild(task));
    }
});
