document.addEventListener("DOMContentLoaded", () => {
    // 1. Disease Search Form
    const searchForm = document.getElementById("disease-search-form");

    searchForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const disease = document.getElementById("disease-name").value;

        if (!disease) {
            alert("Please enter a disease name.");
            return;
        }

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                if (!userLat || !userLon) {
                    alert("Unable to retrieve your location.");
                    return;
                }

                try {
                    const token = localStorage.getItem("token");

                    const response = await fetch(
                        `http://localhost:5000/api/hospitals/search-hospitals?disease=${disease}&userLat=${userLat}&userLon=${userLon}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.ok) {
                        const hospitals = await response.json();
                        displayHospitals(hospitals);
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message || "No hospitals found nearby for the searched disease."}`);
                    }
                } catch (error) {
                    console.error("Error fetching hospitals:", error);
                    alert("An error occurred while fetching hospitals.");
                }
            }, (err) => {
                alert("Unable to get your location. Please try again.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    // Function to display hospital data
    function displayHospitals(hospitals) {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";

        if (hospitals.length === 0) {
            resultsContainer.textContent = "No hospitals found nearby.";
            return;
        }

        hospitals.forEach((hospital) => {
            const hospitalDiv = document.createElement("div");
            hospitalDiv.className = "hospital";

            hospitalDiv.innerHTML = `
                <h3>${hospital.name}</h3>
                <p><strong>Address:</strong> ${hospital.location}</p>
                <p><strong>Contact:</strong> ${hospital.contact_info}</p>
            `;

            resultsContainer.appendChild(hospitalDiv);
        });
    }

    // 2. Associate Hospital with Disease
    const associateForm = document.getElementById("associate-hospital-disease-form");

    associateForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const hospitalId = document.getElementById("hospital-id").value;
        const diseaseId = document.getElementById("disease-id").value;

        if (!hospitalId || !diseaseId) {
            alert("Please enter both Hospital ID and Disease ID.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/hospitals/associate-hospital-disease", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ hospitalId, diseaseId })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || "Failed to associate hospital with disease."}`);
            }
        } catch (error) {
            console.error("Error associating hospital with disease:", error);
            alert("An error occurred while associating hospital with disease.");
        }
    });

    // 3. Associate User with Hospital
    const userAssociateForm = document.getElementById("associate-user-hospital-form");

    userAssociateForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userId = document.getElementById("user-id").value;
        const hospitalId = document.getElementById("hospital-id-user").value;

        if (!userId || !hospitalId) {
            alert("Please enter both User ID and Hospital ID.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/hospitals/associate-user-hospital", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, hospitalId })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || "Failed to associate user with hospital."}`);
            }
        } catch (error) {
            console.error("Error associating user with hospital:", error);
            alert("An error occurred while associating user with hospital.");
        }
    });
});
