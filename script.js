const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");

// Load tasks from local storage when page loads
window.addEventListener('load', () => {
    loadTasks();
});

// Add task when Add button is clicked
addBtn.addEventListener('click', () => {
    addTask();
});

// Add task when Enter key is pressed
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        
        // Save tasks to local storage
        saveTasks();
    }
    inputBox.value = "";
}

// Toggle task completion and delete task
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveTasks();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveTasks();
    }
}, false);

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", listContainer.innerHTML);
}

// Load tasks from local storage
function loadTasks() {
    listContainer.innerHTML = localStorage.getItem("tasks");
}
