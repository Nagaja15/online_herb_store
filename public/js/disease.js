document.addEventListener("DOMContentLoaded", () => {
    const addDiseaseForm = document.getElementById("add-disease-form");
    const associateDiseaseForm = document.getElementById("associate-disease-form");
    const diseaseAssociationsForm = document.getElementById("disease-associations-form");

    // Add a new disease
    addDiseaseForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseName = document.getElementById("disease-name").value;
        const description = document.getElementById("disease-description").value;

        if (!diseaseName || !description) {
            alert("Please fill in both fields.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/diseases/add-disease", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: diseaseName, description }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Disease added successfully! Disease ID: ${data.diseaseId}`);
                addDiseaseForm.reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to add disease: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding disease:", error);
            alert("An error occurred while adding the disease.");
        }
    });

    // Associate disease with a herb
    document.getElementById("associate-herb-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;
        const herbId = document.getElementById("herb-id").value;

        if (!diseaseId || !herbId) {
            alert("Please provide both Disease ID and Herb ID.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first.");
            return;
        }

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
                alert("Disease successfully associated with herb!");
                associateDiseaseForm.reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to associate disease with herb: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error associating disease with herb:", error);
            alert("An error occurred while associating the disease with herb.");
        }
    });

    // Associate disease with a fruit
    document.getElementById("associate-fruit-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;
        const fruitId = document.getElementById("fruit-id").value;

        if (!diseaseId || !fruitId) {
            alert("Please provide both Disease ID and Fruit ID.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first.");
            return;
        }

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
                alert("Disease successfully associated with fruit!");
                associateDiseaseForm.reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to associate disease with fruit: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error associating disease with fruit:", error);
            alert("An error occurred while associating the disease with fruit.");
        }
    });

    // Associate disease with a hospital
    document.getElementById("associate-hospital-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;
        const hospitalId = document.getElementById("hospital-id").value;

        if (!diseaseId || !hospitalId) {
            alert("Please provide both Disease ID and Hospital ID.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/diseases/associate-hospital", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ diseaseId, hospitalId }),
            });

            if (response.ok) {
                alert("Disease successfully associated with hospital!");
                associateDiseaseForm.reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to associate disease with hospital: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error associating disease with hospital:", error);
            alert("An error occurred while associating the disease with hospital.");
        }
    });

    // Fetch associations for a disease
    diseaseAssociationsForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const diseaseId = document.getElementById("disease-id").value;

        if (!diseaseId) {
            alert("Please provide a Disease ID.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/diseases/associations/${diseaseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                alert("Fetched associations successfully!");
                console.log(data); // Display the associations (hospitals, herbs, fruits)
            } else {
                const errorData = await response.json();
                alert(`Failed to fetch disease associations: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error fetching disease associations:", error);
            alert("An error occurred while fetching disease associations.");
        }
    });
});
