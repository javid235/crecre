document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchData = {
        departure: urlParams.get('departure'),
        arrival: urlParams.get('arrival'),
        departureDate: urlParams.get('departureDate'),
        returnDate: urlParams.get('returnDate'),
        passengers: urlParams.get('passengers')
    };

    // Update search summary
    document.getElementById('route-summary').textContent = 
        `${searchData.departure} → ${searchData.arrival} | ${formatDate(searchData.departureDate)}`;

    // Generate dummy flight data
    const flights = generateDummyFlights(searchData);
    let filteredFlights = [...flights];

    // Initialize filters
    initializeFilters(flights);

    // Initialize sorting
    initializeSorting();

    // Display initial results
    displayFlights(filteredFlights);

    // Helper Functions
    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatTime(hours, minutes) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function generateDummyFlights(searchData) {
        const airlines = [
            { name: 'SkyWay Airlines', logo: 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/us.svg' },
            { name: 'Delta Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Delta_logo.svg' },
            { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg' },
            { name: 'Lufthansa', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Lufthansa_Logo_2018.svg'}
        ];

        const flights = [];
        const basePrice = 200;
        const date = new Date(searchData.departureDate);

        for (let i = 0; i < 10; i++) {
            const departureHours = 6 + Math.floor(Math.random() * 12);
            const durationHours = 2 + Math.floor(Math.random() * 8);
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const stops = Math.floor(Math.random() * 3);
            const price = basePrice + (Math.random() * 800);

            flights.push({
                id: i + 1,
                airline: airline.name,
                airlineLogo: airline.logo,
                departure: {
                    city: searchData.departure,
                    time: formatTime(departureHours, Math.floor(Math.random() * 60))
                },
                arrival: {
                    city: searchData.arrival,
                    time: formatTime(departureHours + durationHours, Math.floor(Math.random() * 60))
                },
                duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
                stops: stops,
                price: Math.round(price)
            });
        }

        return flights;
    }

    function displayFlights(flights) {
        const container = document.getElementById('flights-container');
        container.innerHTML = '';
        document.getElementById('results-count').textContent = `${flights.length} flights found`;

        flights.forEach(flight => {
            const card = document.createElement('div');
            card.className = 'flight-card';
            card.innerHTML = `
                <div class="airline-info">
                    <img src="${flight.airlineLogo}" alt="${flight.airline} logo" style="width: 32px; height: 32px; object-fit: contain;">
                    <p>${flight.airline}</p>
                </div>
                <div class="flight-details">
                    <div class="flight-time">
                        <h3>${flight.departure.time}</h3>
                        <p>${flight.departure.city}</p>
                    </div>
                    <div class="flight-route">
                        <i class="fas fa-plane"></i>
                        <p>${flight.duration}</p>
                        <p>${flight.stops === 0 ? 'Non-stop' : flight.stops === 1 ? '1 Stop' : flight.stops + ' Stops'}</p>
                    </div>
                    <div class="flight-time">
                        <h3>${flight.arrival.time}</h3>
                        <p>${flight.arrival.city}</p>
                    </div>
                </div>
                <div class="price-section">
                    <div class="price">$${flight.price}</div>
                    <button class="btn-primary">Select</button>
                </div>
            `;

            card.querySelector('.btn-primary').addEventListener('click', () => {
                // Store flight data and redirect to booking page
                localStorage.setItem('selectedFlight', JSON.stringify(flight));
                window.location.href = 'booking.html';
            });

            container.appendChild(card);
        });
    }

    function initializeFilters(flights) {
        // Price range filter
        const prices = flights.map(f => f.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        const priceRange = document.getElementById('price-range');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');

        priceRange.min = minPrice;
        priceRange.max = maxPrice;
        priceRange.value = maxPrice;

        minPriceInput.value = minPrice;
        maxPriceInput.value = maxPrice;

        // Update filtered results when filters change
        const filterInputs = document.querySelectorAll('.filters-sidebar input');
        filterInputs.forEach(input => {
            input.addEventListener('change', updateResults);
        });

        function updateResults() {
            const selectedAirlines = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
                .map(cb => cb.value);

            filteredFlights = flights.filter(flight => {
                const priceInRange = flight.price >= minPriceInput.value && flight.price <= maxPriceInput.value;
                const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.some(airline => 
                    flight.airline.toLowerCase().includes(airline));
                return priceInRange && airlineMatch;
            });

            displayFlights(filteredFlights);
        }
    }

    function initializeSorting() {
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                sortButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const sortBy = button.dataset.sort;
                sortFlights(sortBy);
            });
        });

        function sortFlights(criteria) {
            switch(criteria) {
                case 'price':
                    filteredFlights.sort((a, b) => a.price - b.price);
                    break;
                case 'duration':
                    filteredFlights.sort((a, b) => {
                        const durationA = parseInt(a.duration.split('h')[0]);
                        const durationB = parseInt(b.duration.split('h')[0]);
                        return durationA - durationB;
                    });
                    break;
                case 'departure':
                    filteredFlights.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
                    break;
            }
            displayFlights(filteredFlights);
        }
    }
});