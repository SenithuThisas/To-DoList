const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");
const themeToggle = document.querySelector(".theme-toggle");
const filterBtns = document.querySelectorAll(".filter-btn");
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");
const categorySelect = document.getElementById("category-select");
const userProfile = document.querySelector(".user-profile");
const userDropdown = document.querySelector(".user-dropdown");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userAvatar = document.getElementById("user-avatar");
const editProfileBtn = document.getElementById("edit-profile");
const logoutBtn = document.getElementById("logout");
const profileModal = document.getElementById("profile-modal");
const profileForm = document.getElementById("profile-form");
const closeModalBtn = document.querySelector(".close-modal");

// State
let tasks = [];
let currentFilter = "all";
let currentUser = null;

// Theme
const theme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", theme);
themeToggle.innerHTML = theme === "light" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;
    updateUserInfo();
}

// Update user information
function updateUserInfo() {
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    // You can add avatar handling here
}

// Load data when page loads
window.addEventListener('load', () => {
    checkAuth();
    loadTasks();
    loadCategories();
    updateStats();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

themeToggle.addEventListener('click', toggleTheme);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        filterTasks();
    });
});

// User profile dropdown
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
    userDropdown.classList.remove('show');
});

// Edit profile
editProfileBtn.addEventListener('click', () => {
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    profileModal.style.display = 'flex';
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

// Profile form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const password = document.getElementById('profile-password').value;
    
    // Update user data
    currentUser.name = name;
    currentUser.email = email;
    if (password) {
        currentUser.password = password;
    }
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    updateUserInfo();
    profileModal.style.display = 'none';
    showNotification('Profile updated successfully!');
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Functions
function addTask() {
    if (inputBox.value.trim() === '') {
        showNotification('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: inputBox.value.trim(),
        completed: false,
        createdAt: new Date(),
        categoryId: categorySelect.value,
        userId: currentUser.id
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    inputBox.value = "";
    categorySelect.value = "";
    showNotification('Task added successfully!');
}

function renderTasks() {
    listContainer.innerHTML = "";
    const filteredTasks = filterTasks();
    
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add("checked");
        }
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                ${task.categoryId ? `<span class="task-category" style="color: ${getCategoryColor(task.categoryId)}">
                    <i class="fas ${getCategoryIcon(task.categoryId)}"></i>
                </span>` : ''}
            </div>
            <div class="task-actions">
                <span class="task-date">${formatDate(task.createdAt)}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Add event listeners
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        listContainer.appendChild(li);
    });
}

function filterTasks() {
    let filtered = tasks.filter(task => task.userId === currentUser.id);
    switch(currentFilter) {
        case 'active':
            filtered = filtered.filter(task => !task.completed);
            break;
        case 'completed':
            filtered = filtered.filter(task => task.completed);
            break;
    }
    return filtered;
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Task deleted!');
}

function updateStats() {
    const userTasks = tasks.filter(task => task.userId === currentUser.id);
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    themeToggle.innerHTML = newTheme === "light" ? 
        '<i class="fas fa-moon"></i>' : 
        '<i class="fas fa-sun"></i>';
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function getCategoryColor(categoryId) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#000';
}

function getCategoryIcon(categoryId) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : 'fa-tag';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .user-profile {
        position: relative;
        cursor: pointer;
    }

    .user-profile img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .user-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--bg-color);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        min-width: 200px;
        z-index: 1000;
    }

    .user-dropdown.show {
        display: block;
    }

    .user-info {
        padding-bottom: 1rem;
        border-bottom: 1px solid #ddd;
        margin-bottom: 1rem;
    }

    .user-info span {
        display: block;
        color: var(--text-color);
    }

    .user-info span:first-child {
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .dropdown-links a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        color: var(--text-color);
        text-decoration: none;
        transition: var(--transition);
    }

    .dropdown-links a:hover {
        color: var(--button-color);
    }

    .task-category {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        margin-left: 0.5rem;
    }

    #category-select {
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        background: var(--input-bg);
        color: var(--text-color);
        margin-right: 1rem;
    }
`;
document.head.appendChild(style);
