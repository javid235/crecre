document.addEventListener('DOMContentLoaded', () => {
    // Initialize date inputs with min date as today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departure-date').min = today;
    document.getElementById('return-date').min = today;

    // Form validation and submission
    const searchForm = document.getElementById('flight-search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            departure: document.getElementById('departure').value,
            arrival: document.getElementById('arrival').value,
            departureDate: document.getElementById('departure-date').value,
            returnDate: document.getElementById('return-date').value,
            passengers: document.getElementById('passengers').value
        };

        // Validate form data
        if (formData.departure === formData.arrival) {
            showError('Departure and arrival cities cannot be the same');
            return;
        }

        if (formData.returnDate && new Date(formData.returnDate) < new Date(formData.departureDate)) {
            showError('Return date cannot be earlier than departure date');
            return;
        }

        // If validation passes, redirect to search results page
        const queryString = new URLSearchParams(formData).toString();
        window.location.href = `search-results.html?${queryString}`;
    });

    // Error message display function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const searchContainer = document.querySelector('.search-container');
        searchContainer.insertBefore(errorDiv, searchForm);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Add error message styles
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            background-color: #fee2e2;
            color: #dc2626;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from { transform: translateY(-1rem); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});