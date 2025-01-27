// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
        }
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add smooth scroll behavior to service buttons
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#iletisim');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Clock functionality
function initClock() {
    const hourHand = document.querySelector('.clock-hand.hour');
    const minuteHand = document.querySelector('.clock-hand.minute');
    const secondHand = document.querySelector('.clock-hand.second');

    function updateClock() {
        // Only update if clock hands exist
        if (!hourHand || !minuteHand || !secondHand) return;

        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hourDeg = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + partial
        const minuteDeg = minutes * 6; // 6 degrees per minute
        const secondDeg = seconds * 6; // 6 degrees per second

        hourHand.style.transform = `rotate(${hourDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }

    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

// Scroll progress functionality
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
}

// Expertise cards hover effect
function initExpertiseCards() {
    const cards = document.querySelectorAll('.expertise-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Update FontAwesome kit code
document.addEventListener('DOMContentLoaded', function() {
    // Replace 'your-kit-code' with your actual FontAwesome kit code
    const faScript = document.querySelector('script[src*="fontawesome"]');
    if (faScript) {
        faScript.src = "https://kit.fontawesome.com/26c3179b26.js";
    }
});

// Handle sound effects (if needed)
function initSoundEffects() {
    const buttons = document.querySelectorAll('button, .expertise-card, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Only play sound if the audio file exists
            const audio = new Audio('hover-sound.mp3');
            audio.volume = 0.2;
            
            audio.play().catch(error => {
                // Silently fail if audio can't be played
                console.debug('Audio not available');
            });
        });
    });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        initSoundEffects();
    } catch (error) {
        console.debug('Sound effects not initialized');
    }
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: this.querySelector('input[type="text"]').value.trim(),
                email: this.querySelector('input[type="email"]').value.trim(),
                phone: this.querySelector('input[type="tel"]').value.trim(),
                service: this.querySelector('select').value
            };

            // Validate form data
            if (!formData.name || !formData.email || !formData.phone || !formData.service) {
                showNotification('Lütfen tüm alanları doldurun.', false);
                return;
            }

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitButton.disabled = true;

            try {
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                showNotification(result.message, result.success);

                // Reset form if successful
                if (result.success) {
                    appointmentForm.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', false);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});

// Helper function to show notifications
function showNotification(message, isSuccess) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;

    // Add notification to page
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
} 