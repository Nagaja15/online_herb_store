

document.addEventListener("DOMContentLoaded", () => {
    const addHerbForm = document.getElementById("add-herb-form");

    addHerbForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const herbName = document.getElementById("herb-name").value;
        const description = document.getElementById("herb-description").value;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/herbs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: herbName, description }),
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
});