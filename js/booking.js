document.addEventListener('DOMContentLoaded', () => {
    // Get selected flight data from localStorage
    const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));

    // Initialize booking state
    const bookingState = {
        currentStep: 0,
        passengerDetails: {},
        selectedSeat: null
    };

    // Display flight summary
    const flightSummary = document.querySelector('.flight-summary');
    flightSummary.innerHTML = `
        <h3>${selectedFlight.airline}</h3>
        <p>${selectedFlight.departure.city} (${selectedFlight.departure.time}) → 
           ${selectedFlight.arrival.city} (${selectedFlight.arrival.time})</p>
        <p>Duration: ${selectedFlight.duration}</p>
        <p>Price: $${selectedFlight.price}</p>
    `;

    // Progress steps
    const progressSteps = document.querySelectorAll('.progress-step');
    const sections = document.querySelectorAll('.booking-section');

    // Passenger Details Form
    const passengerForm = document.getElementById('passenger-form');
    passengerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(passengerForm);
        bookingState.passengerDetails = Object.fromEntries(formData);
        goToStep(1);
    });

    // Seat Selection
    const seatMap = document.querySelector('.seat-map');
    const selectedSeatSpan = document.getElementById('selected-seat');
    const confirmSeatBtn = document.getElementById('confirm-seat');

    // Generate seat map
    const rows = 5;
    const seatsPerRow = 6;
    const occupiedSeats = generateRandomOccupiedSeats(rows * seatsPerRow);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            const seatNumber = i * seatsPerRow + j + 1;
            const seat = document.createElement('div');
            seat.className = `seat ${occupiedSeats.includes(seatNumber) ? 'occupied' : 'available'}`;
            seat.dataset.seat = `${String.fromCharCode(65 + i)}${j + 1}`;
            
            if (!occupiedSeats.includes(seatNumber)) {
                seat.addEventListener('click', () => selectSeat(seat));
            }
            
            seatMap.appendChild(seat);
        }
    }

    function selectSeat(seat) {
        const previousSelected = document.querySelector('.seat.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        seat.classList.add('selected');
        bookingState.selectedSeat = seat.dataset.seat;
        selectedSeatSpan.textContent = bookingState.selectedSeat;
        confirmSeatBtn.disabled = false;
    }

    confirmSeatBtn.addEventListener('click', () => {
        if (bookingState.selectedSeat) {
            goToStep(2);
            updateBookingSummary();
        }
    });

    // Payment Form
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate payment processing
        showProcessingOverlay();
        setTimeout(() => {
            hideProcessingOverlay();
            showSuccessMessage();
        }, 2000);
    });

    // Helper Functions
    function generateRandomOccupiedSeats(total) {
        const occupied = new Set();
        while (occupied.size < Math.floor(total * 0.3)) {
            occupied.add(Math.floor(Math.random() * total) + 1);
        }
        return Array.from(occupied);
    }

    function goToStep(step) {
        bookingState.currentStep = step;
        progressSteps.forEach((s, i) => {
            if (i <= step) s.classList.add('active');
            else s.classList.remove('active');
        });
        sections.forEach((s, i) => {
            if (i === step) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    function updateBookingSummary() {
        const summary = document.querySelector('.booking-summary');
        summary.innerHTML = `
            <h3>Booking Summary</h3>
            <p><strong>Passenger:</strong> ${bookingState.passengerDetails.title}. 
               ${bookingState.passengerDetails.firstName} ${bookingState.passengerDetails.lastName}</p>
            <p><strong>Flight:</strong> ${selectedFlight.airline}</p>
            <p><strong>Route:</strong> ${selectedFlight.departure.city} → ${selectedFlight.arrival.city}</p>
            <p><strong>Seat:</strong> ${bookingState.selectedSeat}</p>
            <p><strong>Total Price:</strong> $${selectedFlight.price}</p>
        `;
    }

    function showProcessingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-content">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Processing Payment...</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add overlay styles
        const style = document.createElement('style');
        style.textContent = `
            .processing-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .processing-content {
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                text-align: center;
            }
            .processing-content i {
                color: var(--primary-color);
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    function hideProcessingOverlay() {
        const overlay = document.querySelector('.processing-overlay');
        if (overlay) overlay.remove();
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle fa-3x"></i>
                <h2>Booking Confirmed!</h2>
                <p>Your flight has been successfully booked.</p>
                <p>A confirmation email has been sent to ${bookingState.passengerDetails.email}</p>
                <button onclick="window.location.href='index.html'" class="btn-primary">Return to Home</button>
            </div>
        `;

        // Add success message styles
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .success-content {
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                text-align: center;
                max-width: 400px;
                margin: 0 1rem;
            }
            .success-content i {
                color: #22c55e;
                margin-bottom: 1rem;
            }
            .success-content h2 {
                margin-bottom: 1rem;
            }
            .success-content p {
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(successMessage);
    }
});