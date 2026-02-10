// Get all elements
const input = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const clearAllBtn = document.querySelector("#clearAll");
const emptyState = document.querySelector("#emptyState");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize app
function init() {
    renderTasks();
    updateStats();
}

// Render all tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        createTaskElement(task, index);
    });
    
    toggleEmptyState();
}

// Create task element
function createTaskElement(task, index) {
    const li = document.createElement("li");
    if (task.completed) {
        li.classList.add("done");
    }

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    
    // Toggle complete on click
    li.addEventListener("click", (e) => {
        if (e.target === li || e.target === taskText) {
            toggleTask(index);
        }
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.setAttribute('aria-label', 'Delete task');

    delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(index);
    });

    li.appendChild(taskText);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}

// Add new task
function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") {
        input.focus();
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
    }

    tasks.push({
        text: taskText,
        completed: false,
        createdAt: Date.now()
    });

    saveTasks();
    renderTasks();
    updateStats();
    
    input.value = "";
    input.focus();
}

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateStats();
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) return;
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Update task counter
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    if (total === 0) {
        taskCount.textContent = '0 tasks';
    } else if (completed === total) {
        taskCount.textContent = `All done! 🎉 (${total})`;
    } else {
        taskCount.textContent = `${completed}/${total} completed`;
    }
}

// Toggle empty state
function toggleEmptyState() {
    if (tasks.length === 0) {
        emptyState.classList.add('show');
        clearAllBtn.style.display = 'none';
    } else {
        emptyState.classList.remove('show');
        clearAllBtn.style.display = 'block';
    }
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
addBtn.addEventListener("click", addTask);

// Add task on Enter key
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Clear all button
clearAllBtn.addEventListener("click", clearAllTasks);

// Initialize app on load
init();