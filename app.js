// State Management
const AppState = {
    user: {
        id: null,
        name: null,
        gender: null,
        balance: 100,
        contacts: []
    },
    isLoggedIn: false
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeLoginPage();
    initializeNavigation();
    initializeLiveStreams();
    initializeCallPage();
});

// Load user data from localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('appUser');
    if (savedUser) {
        AppState.user = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        navigateTo('home');
        updateUI();
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('appUser', JSON.stringify(AppState.user));
}

// Login Page Logic
function initializeLoginPage() {
    const usernameInput = document.getElementById('usernameInput');
    const genderButtons = document.querySelectorAll('.gender-btn');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const startBtn = document.getElementById('startBtn');

    let selectedGender = null;

    // Gender selection
    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGender = btn.dataset.gender;
            checkFormValidity();
        });
    });

    // Check form validity
    function checkFormValidity() {
        const isValid = usernameInput.value.trim() !== '' && 
                       selectedGender !== null && 
                       termsCheckbox.checked;
        startBtn.disabled = !isValid;
    }

    usernameInput.addEventListener('input', checkFormValidity);
    termsCheckbox.addEventListener('change', checkFormValidity);

    // Start button
    startBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        
        // Generate user ID
        const userId = generateUserId();
        
        // Save user data
        AppState.user.id = userId;
        AppState.user.name = username;
        AppState.user.gender = selectedGender;
        AppState.user.balance = 100;
        AppState.isLoggedIn = true;
        
        saveUserData();
        
        // Navigate to home
        navigateTo('home');
        updateUI();
    });
}

// Generate random user ID
function generateUserId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Navigation Logic
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
            
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Navigate to page
function navigateTo(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Update UI with user data
function updateUI() {
    if (!AppState.isLoggedIn) return;
    
    // Update user name
    const userNameElements = document.querySelectorAll('#userName, #profileName');
    userNameElements.forEach(el => {
        el.textContent = AppState.user.name;
    });
    
    // Update avatar
    const avatarElements = document.querySelectorAll('#userAvatarText, #profileAvatarText');
    avatarElements.forEach(el => {
        el.textContent = AppState.user.name.charAt(0).toUpperCase();
    });
    
    // Update balance
    const balanceElements = document.querySelectorAll('#userCoins, #walletBalance');
    balanceElements.forEach(el => {
        el.textContent = AppState.user.balance;
    });
    
    // Update user ID
    const idElements = document.querySelectorAll('#profileId, #modalUserId');
    idElements.forEach(el => {
        el.textContent = AppState.user.id;
    });
    
    // Update online users (random number)
    const onlineUsers = document.getElementById('onlineUsers');
    if (onlineUsers) {
        onlineUsers.textContent = Math.floor(Math.random() * 2000) + 500;
    }
}

// Initialize Live Streams
function initializeLiveStreams() {
    const streamsGrid = document.getElementById('streamsGrid');
    
    // Mock live streams data
    const mockStreams = [
        { name: 'سارة', viewers: 234, avatar: '👩' },
        { name: 'أحمد', viewers: 156, avatar: '👨' },
        { name: 'ليلى', viewers: 89, avatar: '👩' },
        { name: 'محمد', viewers: 412, avatar: '👨' },
        { name: 'نور', viewers: 178, avatar: '👩' },
        { name: 'علي', viewers: 95, avatar: '👨' }
    ];
    
    streamsGrid.innerHTML = mockStreams.map(stream => `
        <div class="stream-card" onclick="joinLiveStream('${stream.name}')">
            <div class="stream-thumbnail">
                <span style="font-size: 3rem;">${stream.avatar}</span>
                <div class="live-badge">🔴 مباشر</div>
            </div>
            <div class="stream-info">
                <div class="stream-name">${stream.name}</div>
                <div class="stream-viewers">👁️ ${stream.viewers} مشاهد</div>
            </div>
        </div>
    `).join('');
}

// Join live stream
function joinLiveStream(name) {
    alert(`🎥 جاري الانضمام إلى بث ${name}...\n\nهذه ميزة تجريبية وستكون متاحة قريباً!`);
}

// Initialize Call Page
function initializeCallPage() {
    const searchBtn = document.getElementById('searchBtn');
    const nextBtn = document.getElementById('nextBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            navigateTo('call');
            simulateMatching();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            simulateMatching();
        });
    }
    
    if (endCallBtn) {
        endCallBtn.addEventListener('click', () => {
            navigateTo('home');
        });
    }
    
    // Gift button
    const giftBtn = document.querySelector('.gift-btn');
    if (giftBtn) {
        giftBtn.addEventListener('click', showGiftModal);
    }
    
    // Add button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addToContacts);
    }
}

// Simulate matching
function simulateMatching() {
    const remoteVideo = document.querySelector('.remote-video');
    remoteVideo.innerHTML = `
        <div class="video-placeholder">
            <div class="searching-animation">
                <div class="search-pulse"></div>
                <span class="search-text">جاري البحث عن شريك...</span>
            </div>
        </div>
    `;
    
    // Simulate finding a match after 2 seconds
    setTimeout(() => {
        const mockUsers = [
            { name: 'سارة', gender: 'female', avatar: '👩' },
            { name: 'أحمد', gender: 'male', avatar: '👨' },
            { name: 'ليلى', gender: 'female', avatar: '👩' },
            { name: 'محمد', gender: 'male', avatar: '👨' },
            { name: 'نور', gender: 'female', avatar: '👩' }
        ];
        
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        
        remoteVideo.innerHTML = `
            <div class="video-placeholder">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${randomUser.avatar}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: white;">${randomUser.name}</div>
                <div style="font-size: 1rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem;">متصل الآن</div>
            </div>
        `;
    }, 2000);
}

// Show gift modal
function showGiftModal() {
    const gifts = [
        { name: 'وردة', icon: '🌹', price: 10 },
        { name: 'قلب', icon: '❤️', price: 20 },
        { name: 'هدية', icon: '🎁', price: 50 },
        { name: 'تاج', icon: '👑', price: 100 },
        { name: 'سيارة', icon: '🚗', price: 500 }
    ];
    
    const giftsHtml = gifts.map(gift => `
        <button onclick="sendGift('${gift.name}', ${gift.price})" 
                style="padding: 1rem; margin: 0.5rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-size: 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${gift.icon}</div>
            <div>${gift.name}</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${gift.price} كوينز</div>
        </button>
    `).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>إرسال هدية</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                    ${giftsHtml}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Send gift
function sendGift(giftName, price) {
    if (AppState.user.balance >= price) {
        AppState.user.balance -= price;
        saveUserData();
        updateUI();
        
        // Close modal
        document.querySelector('.modal').remove();
        
        // Show success message
        showNotification(`تم إرسال ${giftName} بنجاح! 🎉`);
    } else {
        alert('⚠️ رصيدك غير كافٍ!\n\nيرجى شحن المحفظة للمتابعة.');
    }
}

// Add to contacts
function addToContacts() {
    const mockContact = {
        id: generateUserId(),
        name: 'مستخدم ' + Math.floor(Math.random() * 1000)
    };
    
    AppState.user.contacts.push(mockContact);
    saveUserData();
    
    showNotification('✅ تمت إضافة المستخدم إلى جهات الاتصال!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Modal functions
function showChargeModal() {
    const modal = document.getElementById('chargeModal');
    modal.classList.add('active');
}

function showWithdrawModal() {
    const modal = document.getElementById('withdrawModal');
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Copy ID
function copyId() {
    const id = AppState.user.id;
    
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('✅ تم نسخ الـ ID بنجاح!');
}

// Search by ID
document.addEventListener('DOMContentLoaded', () => {
    const searchIdBtn = document.querySelector('.search-id-btn');
    const searchIdInput = document.getElementById('searchIdInput');
    
    if (searchIdBtn && searchIdInput) {
        searchIdBtn.addEventListener('click', () => {
            const searchId = searchIdInput.value.trim();
            if (searchId) {
                // Mock search result
                showNotification(`🔍 جاري البحث عن المستخدم: ${searchId}...`);
                
                setTimeout(() => {
                    alert(`تم العثور على المستخدم!\n\nID: ${searchId}\nالاسم: مستخدم تجريبي\n\nهذه ميزة تجريبية.`);
                }, 1500);
            }
        });
    }
});

// Update online users count every 10 seconds
setInterval(() => {
    const onlineUsers = document.getElementById('onlineUsers');
    if (onlineUsers) {
        onlineUsers.textContent = Math.floor(Math.random() * 2000) + 500;
    }
}, 10000);

// Add CSS animation for fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);
