// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.dataset.tab;
        
        // Update tabs
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update forms
        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${targetForm}-form`).classList.add('active');
    });
});

// Password Toggle
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        btn.classList.toggle('fa-eye');
        btn.classList.toggle('fa-eye-slash');
    });
});

// Form Validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(element, message) {
    const errorDiv = element.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        element.parentNode.insertBefore(error, element.nextSibling);
    } else {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

function hideError(element) {
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.classList.remove('show');
    }
}

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let isValid = true;
    
    // Validate email
    if (!validateEmail(email)) {
        showError(document.getElementById('login-email'), 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(document.getElementById('login-email'));
    }
    
    // Validate password
    if (!validatePassword(password)) {
        showError(document.getElementById('login-password'), 'Password must be at least 6 characters');
        isValid = false;
    } else {
        hideError(document.getElementById('login-password'));
    }
    
    if (isValid) {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Redirect to main page
            window.location.href = 'index.html';
        } else {
            showError(document.getElementById('login-email'), 'Invalid email or password');
        }
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    let isValid = true;
    
    // Validate name
    if (name.trim().length < 2) {
        showError(document.getElementById('signup-name'), 'Name must be at least 2 characters');
        isValid = false;
    } else {
        hideError(document.getElementById('signup-name'));
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showError(document.getElementById('signup-email'), 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(document.getElementById('signup-email'));
    }
    
    // Validate password
    if (!validatePassword(password)) {
        showError(document.getElementById('signup-password'), 'Password must be at least 6 characters');
        isValid = false;
    } else {
        hideError(document.getElementById('signup-password'));
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        showError(document.getElementById('signup-confirm-password'), 'Passwords do not match');
        isValid = false;
    } else {
        hideError(document.getElementById('signup-confirm-password'));
    }
    
    if (isValid) {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showError(document.getElementById('signup-email'), 'Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date()
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Store logged in user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirect to main page
        window.location.href = 'index.html';
    }
}); 