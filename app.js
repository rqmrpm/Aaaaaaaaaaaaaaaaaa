// ===== STATE MANAGEMENT =====
const AppState = {
    user: {
        id: null,
        name: null,
        gender: null,
        balance: 100,
        contacts: [],
        transactions: []
    },
    isLoggedIn: false,
    selectedPackage: null
};

// ===== GIFTS DATABASE =====
const GIFTS_DATABASE = [
    { name: 'بصلة', icon: '🧅', price: 1 },
    { name: 'فلفلة', icon: '🌶️', price: 5 },
    { name: 'خسة', icon: '🥬', price: 10 },
    { name: 'بيتنجانة', icon: '🍆', price: 5 },
    { name: 'وردة', icon: '🌹', price: 10 },
    { name: 'صحن مجدرة', icon: '🍲', price: 10 },
    { name: 'حمل حطب', icon: '🪵', price: 50 },
    { name: 'طاسة مازوة', icon: '🍶', price: 40 },
    { name: 'سندويشة فلافل', icon: '🥙', price: 50 },
    { name: 'كوساي', icon: '🍌', price: 5 },
    { name: 'خيارة', icon: '🥒', price: 3 },
    { name: 'قلب', icon: '❤️', price: 20 },
    { name: 'هدية', icon: '🎁', price: 50 },
    { name: 'تاج', icon: '👑', price: 100 },
    { name: 'سيارة', icon: '🚗', price: 500 }
];

// ===== MOCK USERS =====
const MOCK_USERS = [
    { name: 'سارة', gender: 'female', avatar: '👩' },
    { name: 'أحمد', gender: 'male', avatar: '👨' },
    { name: 'ليلى', gender: 'female', avatar: '👩' },
    { name: 'محمد', gender: 'male', avatar: '👨' },
    { name: 'نور', gender: 'female', avatar: '👩' },
    { name: 'علي', gender: 'male', avatar: '👨' },
    { name: 'فاطمة', gender: 'female', avatar: '👩' },
    { name: 'خالد', gender: 'male', avatar: '👨' }
];

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    if (AppState.isLoggedIn) {
        navigateTo('home');
        updateUI();
    }
    initializeLoginPage();
    initializeNavigation();
    initializeLiveStreams();
    initializeCallPage();
    initializeGiftsModal();
    initializeTransactions();
    setupBackButton();
});

// ===== BACK BUTTON SUPPORT =====
function setupBackButton() {
    window.addEventListener('popstate', () => {
        if (AppState.isLoggedIn) {
            navigateTo('home');
        }
    });
}

// ===== LOAD USER DATA =====
function loadUserData() {
    const savedUser = localStorage.getItem('appUser');
    if (savedUser) {
        AppState.user = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
    }
}

// ===== SAVE USER DATA =====
function saveUserData() {
    localStorage.setItem('appUser', JSON.stringify(AppState.user));
}

// ===== LOGIN PAGE LOGIC =====
function initializeLoginPage() {
    const usernameInput = document.getElementById('usernameInput');
    const genderButtons = document.querySelectorAll('.gender-btn');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const startBtn = document.getElementById('startBtn');

    let selectedGender = null;

    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGender = btn.dataset.gender;
            checkFormValidity();
        });
    });

    function checkFormValidity() {
        const isValid = usernameInput.value.trim() !== '' && 
                       selectedGender !== null && 
                       termsCheckbox.checked;
        startBtn.disabled = !isValid;
    }

    usernameInput.addEventListener('input', checkFormValidity);
    termsCheckbox.addEventListener('change', checkFormValidity);

    startBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const userId = generateUserId();
        
        AppState.user.id = userId;
        AppState.user.name = username;
        AppState.user.gender = selectedGender;
        AppState.user.balance = 100;
        AppState.user.contacts = [];
        AppState.user.transactions = [];
        AppState.isLoggedIn = true;
        
        saveUserData();
        navigateTo('home');
        updateUI();
    });
}

// ===== GENERATE USER ID =====
function generateUserId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ===== NAVIGATION LOGIC =====
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// ===== NAVIGATE TO PAGE =====
function navigateTo(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update nav buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            if (btn.dataset.page === pageName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// ===== UPDATE UI =====
function updateUI() {
    if (!AppState.isLoggedIn) return;
    
    const userNameElements = document.querySelectorAll('#userName, #profileName');
    userNameElements.forEach(el => {
        el.textContent = AppState.user.name;
    });
    
    const avatarElements = document.querySelectorAll('#userAvatarText, #profileAvatarText');
    avatarElements.forEach(el => {
        el.textContent = AppState.user.name.charAt(0).toUpperCase();
    });
    
    const balanceElements = document.querySelectorAll('#userCoins, #walletBalance');
    balanceElements.forEach(el => {
        el.textContent = AppState.user.balance;
    });
    
    const idElements = document.querySelectorAll('#profileId, #modalUserId');
    idElements.forEach(el => {
        el.textContent = AppState.user.id;
    });
    
    const onlineUsers = document.getElementById('onlineUsers');
    if (onlineUsers) {
        onlineUsers.textContent = Math.floor(Math.random() * 2000) + 500;
    }
}

// ===== INITIALIZE LIVE STREAMS =====
function initializeLiveStreams() {
    const streamsGrid = document.getElementById('streamsGrid');
    
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

// ===== JOIN LIVE STREAM =====
function joinLiveStream(name) {
    showNotification(`🎥 جاري الانضمام إلى بث ${name}...`);
}

// ===== INITIALIZE CALL PAGE =====
function initializeCallPage() {
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            navigateTo('call');
            simulateMatching();
        });
    }
}

// ===== SIMULATE MATCHING =====
function simulateMatching() {
    const remoteVideo = document.querySelector('.remote-video');
    const callInfo = document.querySelector('.call-info');
    
    callInfo.innerHTML = `
        <div class="search-pulse"></div>
        <div class="search-text">جاري البحث عن شريك...</div>
    `;
    
    setTimeout(() => {
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        
        document.getElementById('callAvatar').textContent = randomUser.avatar;
        document.getElementById('callName').textContent = randomUser.name;
        document.querySelector('.call-status').textContent = 'متصل الآن';
        
        callInfo.innerHTML = `
            <div class="call-avatar">${randomUser.avatar}</div>
            <div class="call-name">${randomUser.name}</div>
            <div class="call-status">متصل الآن</div>
        `;
    }, 2000);
}

// ===== INITIALIZE GIFTS MODAL =====
function initializeGiftsModal() {
    const giftsGrid = document.getElementById('giftsGrid');
    
    giftsGrid.innerHTML = GIFTS_DATABASE.map((gift, index) => `
        <div class="gift-item" onclick="sendGift('${gift.name}', ${gift.price})">
            <div class="gift-icon">${gift.icon}</div>
            <div class="gift-name">${gift.name}</div>
            <div class="gift-price">${gift.price} 🪙</div>
        </div>
    `).join('');
}

// ===== SHOW GIFT MODAL =====
function showGiftModal() {
    const modal = document.getElementById('giftsModal');
    modal.classList.add('active');
}

// ===== SEND GIFT =====
function sendGift(giftName, price) {
    if (AppState.user.balance >= price) {
        AppState.user.balance -= price;
        
        AppState.user.transactions.push({
            type: 'send',
            title: `إرسال ${giftName}`,
            amount: -price,
            date: new Date().toLocaleString('ar-EG')
        });
        
        saveUserData();
        updateUI();
        closeModal('giftsModal');
        showNotification(`تم إرسال ${giftName} بنجاح! 🎉`);
    } else {
        showNotification('⚠️ رصيدك غير كافٍ!');
    }
}

// ===== ADD TO CONTACTS =====
function addToContacts() {
    const mockContact = {
        id: generateUserId(),
        name: 'مستخدم ' + Math.floor(Math.random() * 1000)
    };
    
    AppState.user.contacts.push(mockContact);
    saveUserData();
    showNotification('✅ تمت إضافة المستخدم إلى جهات الاتصال!');
}

// ===== SHOW NOTIFICATION =====
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

// ===== MODAL FUNCTIONS =====
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

function showChargeModal() {
    const modal = document.getElementById('chargeModal');
    modal.classList.add('active');
}

function showWithdrawModal() {
    const modal = document.getElementById('withdrawModal');
    modal.classList.add('active');
}

// ===== SELECT PACKAGE =====
function selectPackage(amount, price) {
    AppState.selectedPackage = { amount, price };
    showNotification(`✅ تم اختيار الباقة: ${amount} 🪙 بـ ${price}`);
}

// ===== SUBMIT CHARGE REQUEST =====
function submitChargeRequest() {
    if (!AppState.selectedPackage) {
        showNotification('⚠️ يرجى اختيار باقة أولاً');
        return;
    }
    
    showNotification('📤 تم إرسال طلب الشحن لفريق الدعم!');
    closeModal('chargeModal');
    AppState.selectedPackage = null;
}

// ===== SUBMIT WITHDRAW REQUEST =====
function submitWithdrawRequest() {
    const walletInput = document.querySelector('#withdrawModal .modal-input');
    const walletAddress = walletInput.value.trim();
    
    if (!walletAddress) {
        showNotification('⚠️ يرجى إدخال عنوان المحفظة');
        return;
    }
    
    if (AppState.user.balance < 500) {
        showNotification('⚠️ الرصيد غير كافٍ للسحب (الحد الأدنى: 500 كوينز)');
        return;
    }
    
    showNotification('📤 تم إرسال طلب السحب لفريق الدعم!');
    closeModal('withdrawModal');
    walletInput.value = '';
}

// ===== COPY ID =====
function copyId() {
    const id = AppState.user.id;
    
    const tempInput = document.createElement('input');
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('✅ تم نسخ الـ ID بنجاح!');
}

// ===== SEARCH BY ID =====
function searchById() {
    const searchIdInput = document.getElementById('searchIdInput');
    const searchId = searchIdInput.value.trim();
    
    if (searchId) {
        showNotification(`🔍 جاري البحث عن المستخدم: ${searchId}...`);
        
        setTimeout(() => {
            showNotification(`✅ تم العثور على المستخدم!`);
        }, 1500);
    }
}

// ===== INITIALIZE TRANSACTIONS =====
function initializeTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    
    if (!transactionsList) return;
    
    if (AppState.user.transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <div class="empty-text">لا توجد عمليات بعد</div>
            </div>
        `;
        return;
    }
    
    transactionsList.innerHTML = AppState.user.transactions.map(tx => `
        <div class="transaction-item">
            <div class="transaction-icon ${tx.type === 'receive' ? 'receive' : 'send'}">
                ${tx.type === 'receive' ? '⬇️' : '⬆️'}
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${tx.title}</div>
                <div class="transaction-date">${tx.date}</div>
            </div>
            <div class="transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}">
                ${tx.amount > 0 ? '+' : ''}${tx.amount}
            </div>
        </div>
    `).join('');
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem('appUser');
    AppState.isLoggedIn = false;
    AppState.user = {
        id: null,
        name: null,
        gender: null,
        balance: 100,
        contacts: [],
        transactions: []
    };
    navigateTo('login');
    showNotification('👋 تم تسجيل الخروج بنجاح!');
}

// ===== UPDATE ONLINE USERS PERIODICALLY =====
setInterval(() => {
    const onlineUsers = document.getElementById('onlineUsers');
    if (onlineUsers && AppState.isLoggedIn) {
        onlineUsers.textContent = Math.floor(Math.random() * 2000) + 500;
    }
}, 10000);

// ===== HANDLE CONTACTS PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        if (AppState.user.contacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <div class="empty-text">لا توجد جهات اتصال</div>
                    <div class="empty-subtext">ابدأ بإضافة أصدقائك</div>
                </div>
            `;
        } else {
            contactsList.innerHTML = AppState.user.contacts.map(contact => `
                <div class="transaction-item">
                    <div class="transaction-icon receive">👤</div>
                    <div class="transaction-details">
                        <div class="transaction-title">${contact.name}</div>
                        <div class="transaction-date">${contact.id}</div>
                    </div>
                    <button class="copy-btn" onclick="copyContactId('${contact.id}')">📋</button>
                </div>
            `).join('');
        }
    }
});

// ===== COPY CONTACT ID =====
function copyContactId(id) {
    const tempInput = document.createElement('input');
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('✅ تم نسخ الـ ID بنجاح!');
}

// ===== ADD FADE OUT ANIMATION =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);
