// Simple form validation and animation logic
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registration successful!');
        registerForm.reset();
    });
});
