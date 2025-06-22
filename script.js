document.addEventListener('DOMContentLoaded', function() {
    // 배경음악 설정
    const bgm = document.getElementById('bgm');
    const toggleSoundBtn = document.getElementById('toggleSound');
    const soundIcon = toggleSoundBtn.querySelector('.sound-icon');
    
    // 음소거 상태 불러오기
    const isMuted = localStorage.getItem('bgmMuted') === 'true';
    
    // 초기 음소거 상태 설정
    bgm.muted = isMuted;
    updateSoundIcon();
    
    // 페이지 로드 시 자동 재생 시도
    try {
        // 자동 재생 시도
        const playPromise = bgm.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('자동 재생이 차단되었습니다. 사용자 상호작용이 필요합니다:', error);
                // 자동 재생이 실패한 경우 첫 클릭 시 재생 시도
                document.addEventListener('click', function() {
                    if (bgm.paused && !bgm.muted) {
                        bgm.play().catch(e => console.log('재생 실패:', e));
                    }
                }, { once: true });
            });
        }
    } catch (error) {
        console.log('자동 재생 오류:', error);
    }
    
    // 페이지 로드 시 자동 재생 (사용자 상호작용 필요)
    toggleSoundBtn.addEventListener('click', function() {
        if (bgm.paused) {
            bgm.play();
            bgm.muted = false;
            localStorage.setItem('bgmMuted', 'false');
        } else {
            bgm.muted = !bgm.muted;
            localStorage.setItem('bgmMuted', bgm.muted.toString());
        }
        updateSoundIcon();
    });
    
    // 음악 재생 상태 확인 및 필요시 재시도
    setTimeout(() => {
        if (bgm.paused && !bgm.muted) {
            console.log('음악이 재생되지 않았습니다. 재시도합니다.');
            bgm.play().catch(error => {
                console.log('자동 재생이 차단되었습니다:', error);
            });
        }
    }, 1000);
    
    // 음소거 아이콘 업데이트 함수
    function updateSoundIcon() {
        if (bgm.muted) {
            soundIcon.textContent = 'volume_off';
        } else {
            soundIcon.textContent = 'volume_up';
        }
    }
    // Load saved coupon states from localStorage
    loadCouponStates();
    
    // Add event listeners to all coupons
    const coupons = document.querySelectorAll('.coupon');
    const modal = document.getElementById('useModal');
    const closeBtn = document.querySelector('.close');
    const confirmUseBtn = document.getElementById('confirmUse');
    const cancelUseBtn = document.getElementById('cancelUse');
    
    let currentCoupon = null;
    
    // Add click/tap event to flip coupons
    coupons.forEach(coupon => {
        coupon.addEventListener('click', function(e) {
            // Don't flip if clicking on the use button
            if (e.target.classList.contains('use-btn') || 
                e.target.closest('.use-btn')) {
                return;
            }
            
            // Toggle flipped class
            this.classList.toggle('flipped');
        });
    });
    
    // Add click/tap event to use buttons
    document.querySelectorAll('.use-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent coupon flip
            e.preventDefault(); // Prevent default behavior
            
            const coupon = this.closest('.coupon');
            
            // If coupon is already used, do nothing
            if (coupon.classList.contains('used')) {
                return;
            }
            
            // Prevent any parent click events from firing
            e.stopImmediatePropagation();
            
            // Set current coupon and show modal
            currentCoupon = coupon;
            modal.style.display = 'block';
        });
    });
    
    // 모든 버튼 이벤트 다시 바인딩
    function rebindButtonEvents() {
        document.querySelectorAll('.use-btn').forEach(button => {
            // 기존 이벤트 리스너 제거
            button.replaceWith(button.cloneNode(true));
        });
        
        // 새로운 이벤트 리스너 추가
        document.querySelectorAll('.use-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const coupon = this.closest('.coupon');
                
                if (coupon.classList.contains('used')) {
                    return;
                }
                
                e.stopImmediatePropagation();
                
                currentCoupon = coupon;
                modal.style.display = 'block';
            });
        });
    }
    
    // 페이지 로드 후 이벤트 바인딩
    setTimeout(rebindButtonEvents, 500);
    
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
            '#606c38', '#283618', '#dda15e', '#bc6c25', '#588157',
            '#a3b18a', '#e9edc9', '#faedcd'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 페이지 가시성 변경 시 음악 제어
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 페이지가 보이지 않을 때 음악 일시 정지
            if (!bgm.paused && !bgm.muted) {
                bgm.pause();
                bgm.dataset.wasPlaying = 'true';
            }
        } else {
            // 페이지가 다시 보일 때 음악 재생 (이전에 재생 중이었다면)
            if (bgm.dataset.wasPlaying === 'true' && !bgm.muted) {
                bgm.play().catch(e => console.log('재생 실패:', e));
                bgm.dataset.wasPlaying = 'false';
            }
        }
    });
});
