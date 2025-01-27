document.addEventListener("DOMContentLoaded", () => {
    const addHospitalForm = document.getElementById("add-hospital-form");

    addHospitalForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const hospitalName = document.getElementById("hospital-name").value;
        const hospitalLocation = document.getElementById("hospital-location").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/hospitals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: hospitalName, location: hospitalLocation }),
            });

            if (response.ok) {
                alert("Hospital added successfully!");
                addHospitalForm.reset(); // Reset the form after submission
            } else {
                alert("Failed to add hospital. Please try again.");
            }
        } catch (error) {
            console.error("Error adding hospital:", error);
            alert("An error occurred while adding the hospital.");
        }
    });
});
