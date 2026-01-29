// ===== API CONFIGURATION =====
const API_BASE_URL = 'https://bbbbbb.mgdwork12119241.workers.dev';
const ADMIN_USERNAME = 'mgdmgd12119241';

// ===== STATE MANAGEMENT =====
const AppState = {
    user: {
        id: null,
        name: null,
        gender: null,
        balance: 100,
        walletAddress: null,
        networkType: null,
        contacts: [],
        transactions: []
    },
    isLoggedIn: false,
    isAdmin: false,
    selectedPackage: null,
    fabMenuOpen: false,
    fabPosition: { x: 20, y: 20 },
    currentConversation: null,
    adminConversations: []
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
    setupFabMenuCloser();
    initializeDraggableFab();
});

// ===== DRAGGABLE FAB =====
function initializeDraggableFab() {
    const fab = document.querySelector('.fab');
    if (!fab) return;

    let isDragging = false;
    let startX, startY, currentX = 20, currentY = 20;

    fab.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        fab.style.left = currentX + 'px';
        fab.style.top = currentY + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        AppState.fabPosition = { x: currentX, y: currentY };
    });

    // Touch support for mobile
    fab.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - currentX;
        startY = e.touches[0].clientY - currentY;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        fab.style.left = currentX + 'px';
        fab.style.top = currentY + 'px';
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        AppState.fabPosition = { x: currentX, y: currentY };
    });
}

// ===== SETUP FAB MENU CLOSER =====
function setupFabMenuCloser() {
    document.addEventListener('click', (e) => {
        const fab = document.querySelector('.fab');
        const fabMenu = document.getElementById('fabMenu');
        
        if (fab && fabMenu && !fab.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.classList.remove('active');
            AppState.fabMenuOpen = false;
        }
    });
}

// ===== TOGGLE FAB MENU =====
function toggleFabMenu() {
    const fabMenu = document.getElementById('fabMenu');
    if (!fabMenu) return;
    
    AppState.fabMenuOpen = !AppState.fabMenuOpen;
    if (AppState.fabMenuOpen) {
        fabMenu.classList.add('active');
        if (AppState.isAdmin) {
            loadAdminConversations();
        }
    } else {
        fabMenu.classList.remove('active');
    }
}

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
        AppState.isAdmin = AppState.user.name === ADMIN_USERNAME;
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
    const walletInput = document.getElementById('walletInput');
    const networkSelect = document.getElementById('networkSelect');
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
                       walletInput.value.trim() !== '' &&
                       networkSelect.value !== '' &&
                       termsCheckbox.checked;
        startBtn.disabled = !isValid;
    }

    usernameInput.addEventListener('input', checkFormValidity);
    walletInput.addEventListener('input', checkFormValidity);
    networkSelect.addEventListener('change', checkFormValidity);
    termsCheckbox.addEventListener('change', checkFormValidity);

    startBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const walletAddress = walletInput.value.trim();
        const networkType = networkSelect.value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    gender: selectedGender,
                    walletAddress,
                    networkType
                })
            });

            const data = await response.json();
            
            if (data.success) {
                AppState.user = data.user;
                AppState.isLoggedIn = true;
                AppState.isAdmin = username === ADMIN_USERNAME;
                saveUserData();
                navigateTo('home');
                updateUI();
                showNotification('✅ تم إنشاء الحساب بنجاح!');
            } else {
                showNotification('❌ خطأ: ' + (data.error || 'فشل التسجيل'));
            }
        } catch (error) {
            showNotification('❌ خطأ في الاتصال: ' + error.message);
        }
    });
}

// ===== NAVIGATION LOGIC =====
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
            
            const allNavButtons = document.querySelectorAll('.nav-btn');
            allNavButtons.forEach(b => b.classList.remove('active'));
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
        
        // Close FAB menu when navigating
        const fabMenu = document.getElementById('fabMenu');
        if (fabMenu) {
            fabMenu.classList.remove('active');
            AppState.fabMenuOpen = false;
        }
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
    
    const balanceElements = document.querySelectorAll('#profileBalance');
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

    // Show admin panel if user is admin
    if (AppState.isAdmin) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
    }
}

// ===== INITIALIZE LIVE STREAMS =====
function initializeLiveStreams() {
    const streamsGrid = document.getElementById('streamsGrid');
    if (!streamsGrid) return;
    
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
    if (!giftsGrid) return;
    
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
        id: generateId(),
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
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
        fabMenu.classList.remove('active');
        AppState.fabMenuOpen = false;
    }
}

function showExchangeModal() {
    const modal = document.getElementById('exchangeModal');
    modal.classList.add('active');
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
        fabMenu.classList.remove('active');
        AppState.fabMenuOpen = false;
    }
}

// ===== SELECT PACKAGE =====
function selectPackage(amount, price) {
    AppState.selectedPackage = { amount, price };
    showNotification(`✅ تم اختيار الباقة: ${amount} 🪙 بـ ${price}`);
}

// ===== SUBMIT CHARGE REQUEST =====
async function submitChargeRequest() {
    if (!AppState.selectedPackage) {
        showNotification('⚠️ يرجى اختيار باقة أولاً');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/support/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: AppState.user.id,
                username: AppState.user.name,
                message: `طلب شحن: ${AppState.selectedPackage.amount} كوينز`,
                walletAddress: AppState.user.walletAddress,
                networkType: AppState.user.networkType
            })
        });

        const data = await response.json();
        if (data.success) {
            showNotification('📤 تم إرسال طلب الشحن لفريق الدعم!');
            closeModal('chargeModal');
            AppState.selectedPackage = null;
        } else {
            showNotification('❌ خطأ: ' + (data.error || 'فشل الإرسال'));
        }
    } catch (error) {
        showNotification('❌ خطأ في الاتصال: ' + error.message);
    }
}

// ===== SUBMIT EXCHANGE REQUEST =====
async function submitExchangeRequest() {
    const exchangeInput = document.getElementById('exchangeAmount');
    const amount = parseInt(exchangeInput.value);
    
    if (!amount || amount < 500) {
        showNotification('⚠️ الحد الأدنى للتبديل: 500 كوكيز');
        return;
    }
    
    if (AppState.user.balance < amount) {
        showNotification('⚠️ رصيدك غير كافٍ!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/support/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: AppState.user.id,
                username: AppState.user.name,
                message: `طلب تبديل: ${amount} كوينز`,
                walletAddress: AppState.user.walletAddress,
                networkType: AppState.user.networkType
            })
        });

        const data = await response.json();
        if (data.success) {
            showNotification('📤 تم إرسال طلب التبديل لفريق الدعم!');
            closeModal('exchangeModal');
            exchangeInput.value = '';
        } else {
            showNotification('❌ خطأ: ' + (data.error || 'فشل الإرسال'));
        }
    } catch (error) {
        showNotification('❌ خطأ في الاتصال: ' + error.message);
    }
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

// ===== ADMIN FUNCTIONS =====
async function loadAdminConversations() {
    if (!AppState.isAdmin) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/get-conversations`);
        const data = await response.json();
        
        if (data.success) {
            AppState.adminConversations = data.conversations;
            displayAdminConversations();
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

function displayAdminConversations() {
    const fabMenu = document.getElementById('fabMenu');
    if (!fabMenu) return;

    const conversationsHtml = AppState.adminConversations.map(conv => `
        <div class="admin-conversation" onclick="openAdminConversation('${conv.id}')">
            <div class="conv-user">${conv.username}</div>
            <div class="conv-message">${conv.message.substring(0, 30)}...</div>
            <div class="conv-time">${new Date(conv.createdAt).toLocaleTimeString('ar-EG')}</div>
        </div>
    `).join('');

    const adminSection = fabMenu.querySelector('.admin-section');
    if (adminSection) {
        adminSection.innerHTML = conversationsHtml;
    }
}

function openAdminConversation(messageId) {
    AppState.currentConversation = AppState.adminConversations.find(c => c.id === messageId);
    if (AppState.currentConversation) {
        showAdminChatModal();
    }
}

function showAdminChatModal() {
    const modal = document.getElementById('adminChatModal');
    if (!modal) return;

    const conv = AppState.currentConversation;
    const chatContent = document.getElementById('adminChatContent');
    
    chatContent.innerHTML = `
        <div class="admin-chat-header">
            <h3>${conv.username}</h3>
            <p>ID: ${conv.userId}</p>
            <p>محفظة: ${conv.walletAddress} (${conv.networkType})</p>
        </div>
        <div class="admin-chat-messages">
            <div class="message user-message">${conv.message}</div>
            ${conv.replies.map(reply => `
                <div class="message ${reply.isAdmin ? 'admin-message' : 'user-message'}">
                    ${reply.text}
                </div>
            `).join('')}
        </div>
        <div class="admin-charge-buttons">
            <button onclick="chargeUser('${conv.userId}', 100, '100 كوينز')">100 🪙</button>
            <button onclick="chargeUser('${conv.userId}', 500, '500 كوينز')">500 🪙</button>
            <button onclick="chargeUser('${conv.userId}', 1000, '1000 كوينز')">1000 🪙</button>
        </div>
        <div class="admin-reply-section">
            <input type="text" id="adminReplyInput" placeholder="اكتب ردك...">
            <button onclick="sendAdminReply('${conv.id}')">إرسال</button>
        </div>
    `;

    modal.classList.add('active');
}

async function chargeUser(userId, amount, packageName) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/charge-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                amount,
                packageName
            })
        });

        const data = await response.json();
        if (data.success) {
            showNotification(`✅ تم شحن ${packageName} للمستخدم!`);
            loadAdminConversations();
        } else {
            showNotification('❌ خطأ: ' + (data.error || 'فشل الشحن'));
        }
    } catch (error) {
        showNotification('❌ خطأ في الاتصال: ' + error.message);
    }
}

async function sendAdminReply(messageId) {
    const replyInput = document.getElementById('adminReplyInput');
    const reply = replyInput.value.trim();

    if (!reply) {
        showNotification('⚠️ اكتب رداً أولاً');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/support/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messageId,
                reply,
                adminId: AppState.user.id
            })
        });

        const data = await response.json();
        if (data.success) {
            showNotification('✅ تم إرسال الرد!');
            replyInput.value = '';
            loadAdminConversations();
            openAdminConversation(messageId);
        } else {
            showNotification('❌ خطأ: ' + (data.error || 'فشل الإرسال'));
        }
    } catch (error) {
        showNotification('❌ خطأ في الاتصال: ' + error.message);
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem('appUser');
    AppState.isLoggedIn = false;
    AppState.isAdmin = false;
    AppState.user = {
        id: null,
        name: null,
        gender: null,
        balance: 100,
        walletAddress: null,
        networkType: null,
        contacts: [],
        transactions: []
    };
    navigateTo('login');
    showNotification('👋 تم تسجيل الخروج بنجاح!');
}

// ===== UTILITY FUNCTIONS =====
function generateId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
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
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
