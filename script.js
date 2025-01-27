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
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            offset: 50
        });
    } catch (error) {
        console.debug('Initialization error:', error);
    }
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    
    const formData = {
        type: document.getElementById('message-type').value,
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        message: document.getElementById('contact-message').value,
        service: document.getElementById('service').value || null,
        timestamp: Date.now()
    };

    try {
        // Import required functions
        const { getDatabase, ref, push, set } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js');
        
        // Get database instance
        const database = window.database;
        if (!database) {
            throw new Error('Firebase veritabanı başlatılamadı. Lütfen daha sonra tekrar deneyin.');
        }

        console.log('Attempting to save message to database...');
        
        // Get reference to messages in database
        const messagesRef = ref(database, 'messages');
        
        // Generate a new unique key and save the message
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, formData);

        console.log('Message saved successfully');

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Mesajınız başarıyla gönderildi!</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Reset form
        this.reset();
        document.querySelector('.service-group').style.display = 'none';
        
    } catch (error) {
        console.error('Firebase Error:', error);
        
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Bir hata oluştu: ${error.message}</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    } finally {
        submitBtn.innerHTML = originalBtnText;
    }
});

// Show/hide service selection based on message type
document.getElementById('message-type').addEventListener('change', function() {
    const serviceGroup = document.querySelector('.service-group');
    if (this.value === 'appointment') {
        serviceGroup.style.display = 'block';
        document.getElementById('service').required = true;
    } else {
        serviceGroup.style.display = 'none';
        document.getElementById('service').required = false;
    }
});

// Add notification animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .notification {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style); 