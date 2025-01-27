document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const searchForm = document.getElementById("search-form");
    const logoutButtons = document.querySelectorAll(".logout-button");
    const userPage = document.getElementById("user-page");
    const adminPage = document.getElementById("admin-page");
    const searchResults = document.getElementById("search-results");
    const herbList = document.getElementById("herb-list");
    const fruitList = document.getElementById("fruit-list");
    const hospitalList = document.getElementById("hospital-list");

    const API_URL = "http://localhost:5000";

    // Helper function to fetch data
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(`${API_URL}${url}`, options);
            if (!response.ok) throw new Error(await response.text());
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            alert(error.message || "An error occurred. Please try again.");
        }
    }

    // Register Form Submission
    registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        const role = document.getElementById("register-role").value;

        const data = await fetchData("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role }),
        });

        if (data) {
            alert("Registration successful! Please log in.");
            window.location.href = "./login.html";
        }
    });

    // Login Form Submission
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        const data = await fetchData("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            alert("Login successful!");

            if (data.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "user.html";
            }
        }
    });

    // Search Form Submission
    searchForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const disease = document.getElementById("search-input").value.trim();

        if (!disease) {
            alert("Please enter a disease to search.");
            return;
        }

        const token = localStorage.getItem("token");
        const data = await fetchData(`/api/search?disease=${encodeURIComponent(disease)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (data) {
            displaySearchResults(data);
        }
    });

    // Display Search Results
    function displaySearchResults(data) {
        searchResults.innerHTML = `
            <h3>Search Results:</h3>
            <div>
                <h4>Herbs:</h4>
                <ul>${data.herbs.map((herb) => `<li>${herb.name} - ${herb.description}</li>`).join("")}</ul>
            </div>
            <div>
                <h4>Fruits:</h4>
                <ul>${data.fruits.map((fruit) => `<li>${fruit.name} - ${fruit.health_benefits}</li>`).join("")}</ul>
            </div>
            <div>
                <h4>Hospitals:</h4>
                <ul>${data.hospitals.map((hospital) => `<li>${hospital.name} - ${hospital.location}</li>`).join("")}</ul>
            </div>
        `;
    }

    // Logout Functionality
    logoutButtons.forEach((button) => {
        button.addEventListener("click", () => {
            localStorage.clear();
            alert("Logged out successfully!");
            window.location.href = "home.html";
        });
    });

    // Admin Page Logic
    if (window.location.pathname.includes("admin.html")) {
        if (!localStorage.getItem("token")) {
            window.location.href = "login.html";
        }

        async function loadAdminContent() {
            const token = localStorage.getItem("token");

            const herbs = await fetchData("/api/herbs", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fruits = await fetchData("/api/fruits", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const hospitals = await fetchData("/api/hospitals", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (herbs) {
                herbList.innerHTML = herbs.map(
                    (herb) => `
                        <li>
                            ${herb.name} - ${herb.description}
                            <button class="delete-herb" data-id="${herb.id}">Delete</button>
                        </li>
                    `
                ).join("");
            }

            if (fruits) {
                fruitList.innerHTML = fruits.map(
                    (fruit) => `
                        <li>
                            ${fruit.name} - ${fruit.health_benefits}
                            <button class="delete-fruit" data-id="${fruit.id}">Delete</button>
                        </li>
                    `
                ).join("");
            }

            if (hospitals) {
                hospitalList.innerHTML = hospitals.map(
                    (hospital) => `
                        <li>
                            ${hospital.name} - ${hospital.location}
                            <button class="delete-hospital" data-id="${hospital.id}">Delete</button>
                        </li>
                    `
                ).join("");
            }
        }

        adminPage?.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");
            const id = e.target.dataset.id;

            if (e.target.classList.contains("delete-herb")) {
                const response = await fetchData(`/api/herbs/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response) {
                    alert("Herb deleted successfully!");
                    loadAdminContent();
                }
            }

            if (e.target.classList.contains("delete-fruit")) {
                const response = await fetchData(`/api/fruits/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response) {
                    alert("Fruit deleted successfully!");
                    loadAdminContent();
                }
            }

            if (e.target.classList.contains("delete-hospital")) {
                const response = await fetchData(`/api/hospitals/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response) {
                    alert("Hospital deleted successfully!");
                    loadAdminContent();
                }
            }
        });

        loadAdminContent();
    }

    // User Page Logic
    if (window.location.pathname.includes("user.html")) {
        if (!localStorage.getItem("token")) {
            window.location.href = "/public/login.html";
        }
    }
});
