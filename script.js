document.addEventListener('DOMContentLoaded', function() {
    // Load saved coupon states from localStorage
    loadCouponStates();
    
    // Add event listeners to all coupons
    const coupons = document.querySelectorAll('.coupon');
    const modal = document.getElementById('useModal');
    const closeBtn = document.querySelector('.close');
    const confirmUseBtn = document.getElementById('confirmUse');
    const cancelUseBtn = document.getElementById('cancelUse');
    
    let currentCoupon = null;
    
    // Add click event to use buttons
    document.querySelectorAll('.use-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent coupon flip
            
            const coupon = this.closest('.coupon');
            
            // If coupon is already used, do nothing
            if (coupon.classList.contains('used')) {
                return;
            }
            
            // Set current coupon and show modal
            currentCoupon = coupon;
            modal.style.display = 'block';
        });
    });
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Confirm using coupon
    confirmUseBtn.addEventListener('click', function() {
        if (currentCoupon) {
            // Mark coupon as used
            currentCoupon.classList.add('used');
            
            // Update stamp text
            const stamp = currentCoupon.querySelector('.stamp');
            stamp.textContent = '사용됨';
            
            // Update button text
            const useBtn = currentCoupon.querySelector('.use-btn');
            useBtn.textContent = '사용됨';
            useBtn.disabled = true;
            
            // Save state to localStorage
            const couponId = currentCoupon.getAttribute('data-id');
            saveCouponState(couponId, true);
            
            // Add confetti effect
            createConfetti();
            
            // Close modal
            modal.style.display = 'none';
        }
    });
    
    // Cancel using coupon
    cancelUseBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Function to save coupon state to localStorage
    function saveCouponState(couponId, isUsed) {
        const couponStates = JSON.parse(localStorage.getItem('couponStates')) || {};
        couponStates[couponId] = isUsed;
        localStorage.setItem('couponStates', JSON.stringify(couponStates));
    }
    
    // Function to load coupon states from localStorage
    function loadCouponStates() {
        const couponStates = JSON.parse(localStorage.getItem('couponStates')) || {};
        
        for (const couponId in couponStates) {
            if (couponStates[couponId]) {
                const coupon = document.querySelector(`.coupon[data-id="${couponId}"]`);
                if (coupon) {
                    // Mark coupon as used
                    coupon.classList.add('used');
                    
                    // Update stamp text
                    const stamp = coupon.querySelector('.stamp');
                    stamp.textContent = '사용됨';
                    
                    // Update button text
                    const useBtn = coupon.querySelector('.use-btn');
                    useBtn.textContent = '사용됨';
                    useBtn.disabled = true;
                }
            }
        }
    }
    
    // Function to create confetti effect
    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position, color, and animation duration
            const left = Math.random() * 100;
            const width = Math.random() * 10 + 5;
            const height = width * 0.4;
            const bg = getRandomColor();
            const delay = Math.random() * 3;
            const duration = Math.random() * 3 + 3;
            
            confetti.style.cssText = `
                position: fixed;
                left: ${left}vw;
                top: -20px;
                width: ${width}px;
                height: ${height}px;
                background-color: ${bg};
                transform: rotate(${Math.random() * 360}deg);
                animation: fall ${duration}s ease-in ${delay}s forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }
        
        // Add confetti animation if not already in the document
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Function to get random color
    function getRandomColor() {
        const colors = [
            '#ff6b6b', '#f06595', '#cc5de8', '#5c7cfa', '#339af0',
            '#51cf66', '#fcc419', '#ff922b'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});
