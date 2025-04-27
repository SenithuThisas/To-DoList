// DOM Elements
const categoriesContainer = document.getElementById('categories-container');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const closeModalBtn = document.querySelector('.close-modal');

// State
let categories = [];

// Load categories when page loads
window.addEventListener('load', () => {
    loadCategories();
});

// Event Listeners
addCategoryBtn.addEventListener('click', () => {
    categoryModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    categoryModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
        categoryModal.style.display = 'none';
    }
});

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const color = document.getElementById('category-color').value;
    const icon = document.getElementById('category-icon').value;
    
    if (name.trim() === '') {
        showError('Please enter a category name');
        return;
    }
    
    const newCategory = {
        id: Date.now(),
        name,
        color,
        icon,
        taskCount: 0
    };
    
    categories.push(newCategory);
    saveCategories();
    renderCategories();
    categoryModal.style.display = 'none';
    categoryForm.reset();
});

// Functions
function loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
        renderCategories();
    }
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.borderColor = category.color;
        
        categoryCard.innerHTML = `
            <div class="category-icon" style="color: ${category.color}">
                <i class="fas ${category.icon}"></i>
            </div>
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>${category.taskCount} tasks</p>
            </div>
            <div class="category-actions">
                <button class="edit-btn" data-id="${category.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${category.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const editBtn = categoryCard.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editCategory(category.id));
        
        const deleteBtn = categoryCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteCategory(category.id));
        
        categoriesContainer.appendChild(categoryCard);
    });
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-color').value = category.color;
    document.getElementById('category-icon').value = category.icon;
    
    categoryModal.style.display = 'flex';
    
    // Update form submission to handle edit
    categoryForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById('category-name').value;
        const color = document.getElementById('category-color').value;
        const icon = document.getElementById('category-icon').value;
        
        if (name.trim() === '') {
            showError('Please enter a category name');
            return;
        }
        
        category.name = name;
        category.color = color;
        category.icon = icon;
        
        saveCategories();
        renderCategories();
        categoryModal.style.display = 'none';
        categoryForm.reset();
        
        // Reset form submission to handle new categories
        categoryForm.onsubmit = null;
    };
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories = categories.filter(c => c.id !== id);
        saveCategories();
        renderCategories();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    categoryForm.insertBefore(errorDiv, categoryForm.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .categories-app {
        background: var(--bg-color);
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .category-card {
        background: var(--bg-color);
        border: 2px solid;
        border-radius: var(--border-radius);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: var(--transition);
    }

    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .category-icon {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
    }

    .category-info {
        flex: 1;
    }

    .category-info h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-color);
    }

    .category-info p {
        margin: 0.5rem 0 0;
        font-size: 0.9rem;
        color: var(--text-color);
        opacity: 0.7;
    }

    .category-actions {
        display: flex;
        gap: 0.5rem;
    }

    .category-actions button {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        opacity: 0.7;
        transition: var(--transition);
    }

    .category-actions button:hover {
        opacity: 1;
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--bg-color);
        border-radius: var(--border-radius);
        padding: 2rem;
        width: 100%;
        max-width: 400px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .modal-header h3 {
        margin: 0;
        color: var(--text-color);
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-color);
        cursor: pointer;
        opacity: 0.7;
        transition: var(--transition);
    }

    .close-modal:hover {
        opacity: 1;
    }

    select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        background: var(--input-bg);
        color: var(--text-color);
        transition: var(--transition);
    }

    select:focus {
        border-color: var(--button-color);
        outline: none;
    }
`;
document.head.appendChild(style); 