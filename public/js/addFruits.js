document.addEventListener("DOMContentLoaded", () => {
    const addFruitForm = document.getElementById("add-fruit-form");
    const associateFruitForm = document.getElementById("associate-fruit-form");

    // Add a new fruit
    addFruitForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fruitName = document.getElementById("fruit-name").value;
        const healthBenefits = document.getElementById("fruit-health-benefits").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/fruits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: fruitName, health_benefits: healthBenefits }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Fruit added successfully!");
                addFruitForm.reset();
            } else {
                alert("Failed to add fruit. Please try again.");
            }
        } catch (error) {
            console.error("Error adding fruit:", error);
            alert("An error occurred while adding the fruit.");
        }
    });

    // Associate a fruit with a disease
    associateFruitForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;
        const fruitId = document.getElementById("fruit-id").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/fruits/associate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ diseaseId, fruitId }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Fruit associated with disease successfully!");
                associateFruitForm.reset();
            } else {
                alert("Failed to associate fruit with disease. Please try again.");
            }
        } catch (error) {
            console.error("Error associating fruit with disease:", error);
            alert("An error occurred while associating the fruit with disease.");
        }
    });
});
