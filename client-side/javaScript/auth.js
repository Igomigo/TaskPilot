// Simple form validation and animation logic
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // send POST request to the server
            try {
                const response = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        },
                    body: JSON.stringify({username, email, password})
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
    
                if (result.status) {
                    alert("Congrats! your registration was successful");
                    registerForm.reset();
                    window.location.href = "login.html";
                } else {
                    alert(result.error);
                }
            } catch (err) {
                console.log("There was a problem with the fetch operation:", err);
                alert("Registration failed, please try again");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // send POST request to the server
            try {
                const response = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password})
                });
                if (!response.ok) {
                    throw new Error("Network response was not okay");
                }
                const result = await response.json()
                if (result.token) {
                    // store the token securely
                    console.log("Setting token item in local storage");
                    localStorage.setItem("TaskPilot-token", result.token);
                    console.log("Token set successfully");
                    // redirect to the home page
                    window.location.href = "home.html";
                    console.log("Successfully redirected");
                } else {
                    alert("Login failed, please check your credentials");
                }
            } catch (err) {
                console.log("There was a problem with the fetch operation:", err);
                alert("Login attempt failed, please try again");
            }
        });
    }
});
