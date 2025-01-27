document.addEventListener("DOMContentLoaded", () => {
    const addFruitForm = document.getElementById("add-fruit-form");

    addFruitForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fruitName = document.getElementById("fruit-name").value;
        const healthBenefits = document.getElementById("health-benefits").value;

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
                alert("Fruit added successfully!");
                addFruitForm.reset(); // Reset the form after submission
            } else {
                alert("Failed to add fruit. Please try again.");
            }
        } catch (error) {
            console.error("Error adding fruit:", error);
            alert("An error occurred while adding the fruit.");
        }
    });
});
