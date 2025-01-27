document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Event listener for the search form
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        const disease = searchInput.value.trim();
        if (!disease) {
            alert('Please enter a disease to search.');
            return;
        }

        // Clear previous results
        searchResults.innerHTML = `<p>Loading...</p>`;

        try {
            const token = localStorage.getItem('token'); // Get the user token for authorization
            const response = await fetch(`/api/search?disease=${encodeURIComponent(disease)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                displaySearchResults(data); // Display results
            } else {
                alert('Search failed! Please try again.');
            }
        } catch (error) {
            console.error('Error during disease search:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Function to display search results in HTML
    function displaySearchResults(data) {
        searchResults.innerHTML = `
            <h3>Search Results:</h3>
            <div>
                <h4>Herbs:</h4>
                <ul>
                    ${data.herbs.length > 0 ? data.herbs.map(herb => `<li>${herb.name} - ${herb.description}</li>`).join('') : '<li>No herbs found for this disease.</li>'}
                </ul>
            </div>
            <div>
                <h4>Fruits:</h4>
                <ul>
                    ${data.fruits.length > 0 ? data.fruits.map(fruit => `<li>${fruit.name} - ${fruit.health_benefits}</li>`).join('') : '<li>No fruits found for this disease.</li>'}
                </ul>
            </div>
            <div>
                <h4>Hospitals:</h4>
                <ul>
                    ${data.hospitals.length > 0 ? data.hospitals.map(hospital => `<li>${hospital.name} - ${hospital.location}</li>`).join('') : '<li>No hospitals found for this disease.</li>'}
                </ul>
            </div>
        `;
    }
});
