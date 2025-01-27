document.addEventListener("DOMContentLoaded", () => {
    const addHerbForm = document.getElementById("add-herb-form");
    const associateHerbForm = document.getElementById("associate-herb-form");

    // Add a new herb
    addHerbForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const herbName = document.getElementById("herb-name").value;
        const description = document.getElementById("herb-description").value;
        const imageUrl = document.getElementById("herb-image-url").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/herbs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: herbName, description, image_url: imageUrl }),
            });

            if (response.ok) {
                alert("Herb added successfully!");
                addHerbForm.reset();
            } else {
                alert("Failed to add herb. Please try again.");
            }
        } catch (error) {
            console.error("Error adding herb:", error);
            alert("An error occurred while adding the herb.");
        }
    });

    // Associate a herb with a disease
    associateHerbForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;
        const herbId = document.getElementById("herb-id").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/herbs/associate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ diseaseId, herbId }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Herb associated with disease successfully!");
                associateHerbForm.reset();
            } else {
                alert("Failed to associate herb with disease. Please try again.");
            }
        } catch (error) {
            console.error("Error associating herb with disease:", error);
            alert("An error occurred while associating the herb with disease.");
        }
    });
});
