// Zubair Digital Hub - Main Application Logic

let currentPlatform = 'all';
let currentCurrency = 'PKR'; // PKR or USDT
let allListings = [];
let allReviews = [];
let adminConfig = {};
let paymentMethods = {};
let supportConfig = {};
let isAdminLoggedIn = false;

let allServices = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadAdminConfig();
    loadSupportConfig();
    loadPaymentMethods();
    loadListings();
    loadReviews();
    loadServices();
    setupEventListeners();
    renderMarketplace();
    renderReviews();
    renderServices('all');
    initEscrowCalculator();
    updateAdminUIState();
    updateSupportUIElements();
});

// REAL-TIME SYNCHRONIZATION LISTENER (Syncs Admin Panel changes to Website instantly without refresh)
window.addEventListener('storage', (e) => {
    loadAdminConfig();
    loadSupportConfig();
    loadPaymentMethods();
    loadListings();
    loadReviews();
    loadServices();

    renderMarketplace();
    renderReviews();
    renderServices(currentPlatform);
    updateAdminUIState();
    updateSupportUIElements();
});

function updateSupportUIElements() {
    const floatWaBtn = document.getElementById('floating-wa-btn');
    if (floatWaBtn && supportConfig.supportWhatsapp) {
        const cleanWa = supportConfig.supportWhatsapp.replace(/[^0-9]/g, '');
        floatWaBtn.href = `https://wa.me/${cleanWa}?text=Hello%20Zubair%20Digital%20Hub!%20I%20have%20an%20inquiry.`;
    }
}

// Load Admin Credentials & Auth State
function loadAdminConfig() {
    const savedConfig = localStorage.getItem('zdh_admin_config');
    if (savedConfig) {
        try {
            adminConfig = JSON.parse(savedConfig);
        } catch (e) {
            adminConfig = { ...defaultAdminConfig };
        }
    } else {
        adminConfig = { ...defaultAdminConfig };
        localStorage.setItem('zdh_admin_config', JSON.stringify(adminConfig));
    }

    isAdminLoggedIn = localStorage.getItem('zdh_admin_session') === 'true';
}

// Load Client Support Config
function loadSupportConfig() {
    const savedSupport = localStorage.getItem('zdh_support_config');
    if (savedSupport) {
        try {
            supportConfig = JSON.parse(savedSupport);
            supportConfig.supportPhone = "+92 302 3632638";
            supportConfig.supportWhatsapp = "+92 302 3632638";
            localStorage.setItem('zdh_support_config', JSON.stringify(supportConfig));
        } catch (e) {
            supportConfig = { ...defaultSupportConfig };
            localStorage.setItem('zdh_support_config', JSON.stringify(supportConfig));
        }
    } else {
        supportConfig = { ...defaultSupportConfig };
        localStorage.setItem('zdh_support_config', JSON.stringify(supportConfig));
    }
}

// Load Payment Methods / Wallet Addresses
function loadPaymentMethods() {
    const savedMethods = localStorage.getItem('zdh_payment_methods');
    if (savedMethods) {
        try {
            paymentMethods = JSON.parse(savedMethods);
            paymentMethods.jazzcash = "+92 308 3727339 (Muhammad zubair zafar)";
            paymentMethods.easypaisa = "+92 302 3632638 (Muhammad zubair zafar)";
            paymentMethods.bankName = "United Bank Limited (UBL)";
            paymentMethods.bankAccount = "PK24UNIL0109000378922612 (Zubair digital hub)";
            paymentMethods.usdtWallet = "TMYEB4BvVxFi1AvrLZJsVP6JWm51BwzCvm";
            paymentMethods.binancePayId = "82187140 (zubair zubi001)";
            localStorage.setItem('zdh_payment_methods', JSON.stringify(paymentMethods));
        } catch (e) {
            paymentMethods = { ...defaultPaymentMethods };
            localStorage.setItem('zdh_payment_methods', JSON.stringify(paymentMethods));
        }
    } else {
        paymentMethods = { ...defaultPaymentMethods };
        localStorage.setItem('zdh_payment_methods', JSON.stringify(paymentMethods));
    }
}

// Load listings from localStorage (Purges any sample fake listings)
function loadListings() {
    const saved = localStorage.getItem('zdh_listings');
    if (saved) {
        try {
            allListings = JSON.parse(saved);
            // Purge all sample fake listing IDs if present
            const sampleIds = ['yt-101', 'yt-102', 'yt-201', 'fb-201', 'fb-202', 'fb-202', 'tt-301', 'tt-302', 'tt-203', 'ig-401', 'ig-402', 'ig-204', 'tw-501', 'tw-205'];
            allListings = allListings.filter(l => !sampleIds.includes(l.id));
            localStorage.setItem('zdh_listings', JSON.stringify(allListings));
        } catch (e) {
            allListings = [];
            localStorage.setItem('zdh_listings', JSON.stringify(allListings));
        }
    } else {
        allListings = [];
        localStorage.setItem('zdh_listings', JSON.stringify(allListings));
    }
}

// Load reviews from localStorage or fallback to sampleReviews
function loadReviews() {
    const saved = localStorage.getItem('zdh_reviews');
    if (saved) {
        try {
            allReviews = JSON.parse(saved);
        } catch (e) {
            allReviews = (typeof sampleReviews !== 'undefined' && Array.isArray(sampleReviews)) ? [...sampleReviews] : [];
        }
    } else {
        allReviews = (typeof sampleReviews !== 'undefined' && Array.isArray(sampleReviews)) ? [...sampleReviews] : [];
    }
}

// Default Growth Services Dataset with Matching Platform Images
const defaultGrowthServices = [
    // YOUTUBE SERVICES
    {
        id: 'srv-yt-101',
        name: 'YouTube 4,000 Hours Watch Time',
        platform: 'youtube',
        image: 'assets/images/proofs/youtube_analytics_proof_1.jpg',
        delivery: '3-5 Days',
        pricePKR: 6500,
        priceUSD: 24,
        rating: '5.0 ★',
        guarantee: 'Non-Drop & Lifetime Guarantee'
    },
    {
        id: 'srv-yt-102',
        name: 'YouTube 1,000 Monetization Subscribers',
        platform: 'youtube',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
        delivery: '2-4 Days',
        pricePKR: 4200,
        priceUSD: 15,
        rating: '4.9 ★',
        guarantee: 'Real & Non-Drop'
    },
    {
        id: 'srv-yt-103',
        name: 'YouTube High RPM Organic Views (10,000 Views)',
        platform: 'youtube',
        image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=800&q=80',
        delivery: '24-48 Hours',
        pricePKR: 2800,
        priceUSD: 10,
        rating: '4.9 ★',
        guarantee: 'High Audience Retention'
    },
    {
        id: 'srv-yt-104',
        name: 'PIN Verified Google AdSense Account (Pakistan / Global)',
        platform: 'youtube',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        delivery: 'Instant Handover',
        pricePKR: 8500,
        priceUSD: 30,
        rating: '5.0 ★',
        guarantee: 'Identity & Address Verified'
    },
    {
        id: 'srv-yt-105',
        name: 'Complete YouTube Channel Monetization Package',
        platform: 'youtube',
        image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80',
        delivery: '7 Days',
        pricePKR: 9999,
        priceUSD: 36,
        rating: '5.0 ★',
        guarantee: '100% Monetization Approval'
    },
    {
        id: 'srv-yt-106',
        name: 'YouTube Shorts 10 Million Views (Shorts Monetization)',
        platform: 'youtube',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        delivery: '5-7 Days',
        pricePKR: 8900,
        priceUSD: 32,
        rating: '5.0 ★',
        guarantee: 'Viral Algorithm Boost'
    },

    // FACEBOOK SERVICES
    {
        id: 'srv-fb-201',
        name: 'Facebook In-Stream Watch Time (60,000 Minutes)',
        platform: 'facebook',
        image: 'assets/images/proofs/facebook_monetization_proof_1.jpg',
        delivery: '48 Hours',
        pricePKR: 4500,
        priceUSD: 16,
        rating: '5.0 ★',
        guarantee: '100% Monetization Criteria Met'
    },
    {
        id: 'srv-fb-202',
        name: 'Facebook Page Followers (10,000 Real Followers)',
        platform: 'facebook',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        delivery: '2-3 Days',
        pricePKR: 3500,
        priceUSD: 13,
        rating: '4.9 ★',
        guarantee: 'Non-Drop Guaranteed'
    },
    {
        id: 'srv-fb-203',
        name: 'Facebook Stars & Performance Bonus Monetization Approval',
        platform: 'facebook',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&q=80',
        delivery: '3-4 Days',
        pricePKR: 5500,
        priceUSD: 20,
        rating: '5.0 ★',
        guarantee: 'Approved Payout Setup'
    },
    {
        id: 'srv-fb-204',
        name: 'Facebook Group Members Boost (10,000 Active Members)',
        platform: 'facebook',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        delivery: '3-4 Days',
        pricePKR: 4000,
        priceUSD: 15,
        rating: '4.8 ★',
        guarantee: 'Real Profiles'
    },

    // TIKTOK SERVICES
    {
        id: 'srv-tt-301',
        name: 'TikTok Organic Followers (10,000 Followers)',
        platform: 'tiktok',
        image: 'assets/images/proofs/tiktok_creator_proof_1.jpg',
        delivery: '24-48 Hours',
        pricePKR: 3200,
        priceUSD: 12,
        rating: '4.9 ★',
        guarantee: 'Unlocks LIVE Streaming & Gifts'
    },
    {
        id: 'srv-tt-302',
        name: 'TikTok USA / UK Region Creator Beta Rewards Account',
        platform: 'tiktok',
        image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80',
        delivery: 'Instant Handover',
        pricePKR: 3500,
        priceUSD: 13,
        rating: '5.0 ★',
        guarantee: '100% Monetizable'
    },
    {
        id: 'srv-tt-303',
        name: 'TikTok Video Views Booster (100,000 Viral Views)',
        platform: 'tiktok',
        image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=800&q=80',
        delivery: '12-24 Hours',
        pricePKR: 1500,
        priceUSD: 6,
        rating: '5.0 ★',
        guarantee: 'For You Page (FYP) Push'
    },
    {
        id: 'srv-tt-304',
        name: 'TikTok Live Streaming Viewers & Likes Package',
        platform: 'tiktok',
        image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
        delivery: 'Instant Live',
        pricePKR: 2500,
        priceUSD: 9,
        rating: '4.8 ★',
        guarantee: 'Real-Time Engagement'
    },

    // INSTAGRAM SERVICES
    {
        id: 'srv-ig-401',
        name: 'Instagram Real Followers (10,000 Non-Drop Followers)',
        platform: 'instagram',
        image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=800&q=80',
        delivery: '2-3 Days',
        pricePKR: 3800,
        priceUSD: 14,
        rating: '4.9 ★',
        guarantee: 'Lifetime Refill Guarantee'
    },
    {
        id: 'srv-ig-402',
        name: 'Instagram Reel Viral Views Push (100,000 Views)',
        platform: 'instagram',
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
        delivery: 'Instant',
        pricePKR: 2200,
        priceUSD: 8,
        rating: '4.9 ★',
        guarantee: 'Explore Page Recommendation'
    },
    {
        id: 'srv-ig-403',
        name: 'Instagram Meta Verified Blue Tick Badge Setup Assistance',
        platform: 'instagram',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
        delivery: '24 Hours',
        pricePKR: 4500,
        priceUSD: 16,
        rating: '5.0 ★',
        guarantee: '100% Verification Support'
    },

    // TWITTER / X SERVICES
    {
        id: 'srv-tw-501',
        name: 'Twitter / X Monetization Impression Package (5 Million)',
        platform: 'twitter',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        delivery: '3 Days',
        pricePKR: 7500,
        priceUSD: 27,
        rating: '5.0 ★',
        guarantee: 'X Creator Ad Revenue Sharing Eligible'
    },
    {
        id: 'srv-tw-502',
        name: 'Twitter / X Premium Organic Followers (5,000 Followers)',
        platform: 'twitter',
        image: 'https://images.unsplash.com/photo-1611605698323-b1e992d37777?auto=format&fit=crop&w=800&q=80',
        delivery: '2-4 Days',
        pricePKR: 4500,
        priceUSD: 16,
        rating: '4.8 ★',
        guarantee: 'High Quality Active Accounts'
    }
];

// Load Growth Services from localStorage or fallback to defaultGrowthServices
function loadServices() {
    const saved = localStorage.getItem('zdh_growth_services');
    if (saved) {
        try {
            allServices = JSON.parse(saved);
            if (!Array.isArray(allServices) || allServices.length < defaultGrowthServices.length) {
                allServices = [...defaultGrowthServices];
                localStorage.setItem('zdh_growth_services', JSON.stringify(allServices));
            }
        } catch (e) {
            allServices = [...defaultGrowthServices];
            localStorage.setItem('zdh_growth_services', JSON.stringify(allServices));
        }
    } else {
        allServices = [...defaultGrowthServices];
        localStorage.setItem('zdh_growth_services', JSON.stringify(allServices));
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation / Platform Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = tab.dataset.platform;
            switchPlatform(platform);
        });
    });

    // Search Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderMarketplace();
        });
    }

    // Filter Selects
    const monetizationFilter = document.getElementById('monetization-filter');
    const priceFilter = document.getElementById('price-filter');
    if (monetizationFilter) monetizationFilter.addEventListener('change', renderMarketplace);
    if (priceFilter) priceFilter.addEventListener('change', renderMarketplace);

    // List Account Form Submission
    const sellForm = document.getElementById('sell-account-form');
    if (sellForm) {
        sellForm.addEventListener('submit', handleSellFormSubmit);
    }

    // Review Form Submission
    const reviewForm = document.getElementById('add-review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Admin Login Form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);
    }

    // Admin Change Credentials Form
    const changeCredForm = document.getElementById('admin-cred-form');
    if (changeCredForm) {
        changeCredForm.addEventListener('submit', handleAdminCredSubmit);
    }

    // Admin Wallet Addresses Form
    const walletForm = document.getElementById('admin-wallet-form');
    if (walletForm) {
        walletForm.addEventListener('submit', handleAdminWalletSubmit);
    }

    // Admin Support Settings Form
    const adminSupportForm = document.getElementById('admin-support-form');
    if (adminSupportForm) {
        adminSupportForm.addEventListener('submit', handleAdminSupportSubmit);
    }

    // Client Support Ticket Form
    const supportTicketForm = document.getElementById('support-ticket-form');
    if (supportTicketForm) {
        supportTicketForm.addEventListener('submit', handleSupportTicketSubmit);
    }

    // Direct DM Form Submission
    const dmForm = document.getElementById('direct-dm-form');
    if (dmForm) {
        dmForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const listingId = document.getElementById('dm-listing-id')?.value;
            const name = document.getElementById('dm-buyer-name')?.value || 'Buyer';
            const msg = document.getElementById('dm-buyer-msg')?.value || '';
            const item = allListings.find(l => l.id === listingId);

            const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
            const pathname = window.location.pathname || 'index.html';
            const listingDirectUrl = item ? `${origin}${pathname}#${item.id}` : window.location.href;

            const newInq = {
                id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
                clientName: name,
                phoneWhatsapp: `On-Site DM`,
                email: `${name.toLowerCase().replace(/\s+/g, '')}@client.com`,
                accountInterested: item ? `${item.title} (${item.handle})` : 'Listing Inquiry',
                offeredAmount: item ? `PKR ${item.price.toLocaleString()}` : 'Custom Offer',
                messageText: `${msg}\n\n[🔗 Direct Link: ${listingDirectUrl}]`,
                date: 'Just now',
                status: 'Unread / New'
            };

            if (!window.allInquiries) window.allInquiries = [];
            window.allInquiries.unshift(newInq);
            localStorage.setItem('zdh_inquiries', JSON.stringify(window.allInquiries));

            alert(`💬 DIRECT MESSAGE SENT TO MASTER ADMIN PANEL!\n\nThank you ${name}.\n\nYour message regarding "${newInq.accountInterested}" with Direct Website Link has been delivered to Master Owner Zubair.`);
            closeDirectDMModal();
        });
    }
}

// Switch Platform Theme, Background Visual & Dynamic Logo Badge Above Title
function switchPlatform(platform) {
    currentPlatform = platform;
    document.body.setAttribute('data-platform', platform);

    // Update active nav buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        if (tab.dataset.platform === platform) {
            tab.classList.add('bg-white/10', 'text-white', 'border-b-2', 'border-indigo-500');
            tab.classList.remove('text-gray-400');
        } else {
            tab.classList.remove('bg-white/10', 'text-white', 'border-b-2', 'border-indigo-500');
            tab.classList.add('text-gray-400');
        }
    });

    const titleElem = document.getElementById('hero-platform-title');
    const descElem = document.getElementById('hero-platform-desc');
    const watermarkElem = document.getElementById('platform-watermark-icon');
    const logoBadgeElem = document.getElementById('hero-platform-logo-badge');

    const headers = {
        all: { 
            title: `ZUBAIR <span class="gradient-text">DIGITAL HUB</span>`, 
            desc: "Global #1 Social Media Account Buying & Selling Escrow Portal. Auto-converted prices in USDT ($) & Local Currencies.",
            icon: `<i class="fa-solid fa-shield-halved"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl btn-brand flex items-center justify-center text-3xl shadow-2xl mb-4 mx-auto animate-bounce"><i class="fa-solid fa-shield-halved"></i></div>`
        },
        youtube: { 
            title: `YOUTUBE <span class="text-red-500">CHANNELS HUB</span>`, 
            desc: "Buy Monetized YouTube Channels, 4000 Watch Hours & Subscribers with Guaranteed Instant Ownership Transfer.",
            icon: `<i class="fa-brands fa-youtube text-red-500"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl bg-red-600/30 border-2 border-red-500 text-red-500 flex items-center justify-center text-3xl shadow-2xl shadow-red-500/40 mb-4 mx-auto animate-bounce"><i class="fa-brands fa-youtube"></i></div>`
        },
        facebook: { 
            title: `FACEBOOK <span class="text-blue-500">PAGES HUB</span>`, 
            desc: "Verified FB Pages with In-Stream Ads enabled, High Member Groups & Followers with Safe Escrow Handover.",
            icon: `<i class="fa-brands fa-facebook text-blue-500"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl bg-blue-600/30 border-2 border-blue-500 text-blue-500 flex items-center justify-center text-3xl shadow-2xl shadow-blue-500/40 mb-4 mx-auto animate-bounce"><i class="fa-brands fa-facebook"></i></div>`
        },
        tiktok: { 
            title: `TIKTOK <span class="text-cyan-400">CREATOR HUB</span>`, 
            desc: "US TikTok Beta Creator Rewards Accounts, Live Studio Access & Organic Viral Handles.",
            icon: `<i class="fa-brands fa-tiktok text-cyan-400"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl bg-cyan-500/30 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center text-3xl shadow-2xl shadow-cyan-400/40 mb-4 mx-auto animate-bounce"><i class="fa-brands fa-tiktok"></i></div>`
        },
        instagram: { 
            title: `INSTAGRAM <span class="text-pink-500">THEME PAGES</span>`, 
            desc: "High Engagement IG Theme Pages, Aged Accounts with Original Email & Active Reach.",
            icon: `<i class="fa-brands fa-instagram text-pink-500"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl bg-pink-600/30 border-2 border-pink-500 text-pink-500 flex items-center justify-center text-3xl shadow-2xl shadow-pink-500/40 mb-4 mx-auto animate-bounce"><i class="fa-brands fa-instagram"></i></div>`
        },
        twitter: { 
            title: `TWITTER / X <span class="text-blue-400">MONETIZED HUB</span>`, 
            desc: "X Revenue Sharing Accounts, Aged Handles & Tech Profiles with Escrow Guarantee.",
            icon: `<i class="fa-brands fa-x-twitter text-blue-400"></i>`,
            badge: `<div class="w-16 h-16 rounded-2xl bg-sky-500/30 border-2 border-sky-400 text-sky-400 flex items-center justify-center text-3xl shadow-2xl shadow-sky-400/40 mb-4 mx-auto animate-bounce"><i class="fa-brands fa-x-twitter"></i></div>`
        }
    };

    if (titleElem && headers[platform]) {
        titleElem.innerHTML = headers[platform].title;
    }
    if (descElem && headers[platform]) {
        descElem.innerText = headers[platform].desc;
    }
    if (watermarkElem && headers[platform]) {
        watermarkElem.innerHTML = headers[platform].icon;
    }
    if (logoBadgeElem && headers[platform]) {
        logoBadgeElem.innerHTML = headers[platform].badge;
    }

    renderMarketplace();
    renderReviews();
    renderServices(platform);

    if (platform !== 'all') {
        const marketSection = document.getElementById('marketplace-section');
        if (marketSection) {
            marketSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Currency Switcher Logic (PKR <-> USDT)
function switchCurrency(currency) {
    currentCurrency = currency;
    
    const pkrBtn = document.getElementById('curr-pkr-btn');
    const usdtBtn = document.getElementById('curr-usdt-btn');
    const mobPkrBtn = document.getElementById('mob-curr-pkr-btn');
    const mobUsdtBtn = document.getElementById('mob-curr-usdt-btn');

    if (pkrBtn && usdtBtn) {
        if (currency === 'PKR') {
            pkrBtn.className = "px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow";
            usdtBtn.className = "px-2.5 py-1 text-xs font-bold rounded-lg text-gray-400 hover:text-white";
        } else {
            usdtBtn.className = "px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 shadow";
            pkrBtn.className = "px-2.5 py-1 text-xs font-bold rounded-lg text-gray-400 hover:text-white";
        }
    }

    if (mobPkrBtn && mobUsdtBtn) {
        if (currency === 'PKR') {
            mobPkrBtn.className = "px-2 py-0.5 font-bold rounded text-white bg-indigo-600";
            mobUsdtBtn.className = "px-2 py-0.5 font-bold rounded text-gray-400";
        } else {
            mobUsdtBtn.className = "px-2 py-0.5 font-bold rounded text-slate-950 bg-emerald-400";
            mobPkrBtn.className = "px-2 py-0.5 font-bold rounded text-gray-400";
        }
    }

    renderMarketplace();
    renderServices(currentPlatform);
    calculateEscrowFee();
}

// Helper to Format Price according to selected currency
function formatPrice(amountPKR) {
    const rate = parseFloat(paymentMethods.exchangeRate) || 280;
    if (currentCurrency === 'USDT' || currentCurrency === 'USD') {
        const usdtVal = Math.round(amountPKR / rate);
        return `$ ${usdtVal.toLocaleString()} USDT`;
    } else {
        return `PKR ${amountPKR.toLocaleString()}`;
    }
}

// Update Admin Header Button & Badges
function updateAdminUIState() {
    const btn = document.getElementById('admin-header-btn');
    if (!btn) return;

    if (isAdminLoggedIn) {
        btn.innerHTML = `<i class="fa-solid fa-crown text-amber-400"></i> Admin Dashboard`;
        btn.className = "px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10";
        btn.onclick = openAdminDashboardModal;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-lock"></i> Master Login`;
        btn.className = "px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5";
        btn.onclick = openAdminLoginModal;
    }
}

// Admin Support Settings Submission
function handleAdminSupportSubmit(e) {
    e.preventDefault();

    supportConfig.supportPhone = document.getElementById('admin-supp-phone')?.value || supportConfig.supportPhone;
    supportConfig.supportWhatsapp = document.getElementById('admin-supp-wa')?.value || supportConfig.supportWhatsapp;
    supportConfig.supportEmail = document.getElementById('admin-supp-email')?.value || supportConfig.supportEmail;
    supportConfig.supportHours = document.getElementById('admin-supp-hours')?.value || supportConfig.supportHours;

    localStorage.setItem('zdh_support_config', JSON.stringify(supportConfig));
    alert('Client Support contact details updated successfully!');
}

// Client Support Ticket Submission
function handleSupportTicketSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('ticket-name')?.value;
    const phone = document.getElementById('ticket-phone')?.value;
    const issueType = document.getElementById('ticket-issue-type')?.value;
    const message = document.getElementById('ticket-message')?.value;

    if (!name || !phone || !message) {
        alert('Please fill out all required fields.');
        return;
    }

    const whatsappMsg = `Hello Zubair Digital Hub Support!\n\n` +
        `🚨 *NEW CLIENT SUPPORT ISSUE TICKET*\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Client Phone:* ${phone}\n` +
        `🏷️ *Issue Category:* ${issueType}\n` +
        `💬 *Message / Concern:* ${message}\n\n` +
        `Please assist me immediately.`;

    closeSupportModal();
    window.open(`https://wa.me/${(supportConfig.supportWhatsapp || '').replace(/[^0-9]/g, '') || '923023632638'}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
}

function openSupportModal() {
    const modal = document.getElementById('support-modal');
    const displayPhone = document.getElementById('supp-display-phone');
    const displayWhatsapp = document.getElementById('supp-display-wa');
    const displayEmail = document.getElementById('supp-display-email');
    const displayHours = document.getElementById('supp-display-hours');

    if (displayPhone) displayPhone.innerText = supportConfig.supportPhone || '+1 (800) 555-0199';
    if (displayWhatsapp) displayWhatsapp.innerText = supportConfig.supportWhatsapp || '+1 800 555 0199';
    if (displayEmail) displayEmail.innerText = supportConfig.supportEmail || 'support@zubairdigitalhub.com';
    if (displayHours) displayHours.innerText = supportConfig.supportHours || '24/7 Priority Support';

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Master Admin Login Handler
function handleAdminLoginSubmit(e) {
    e.preventDefault();

    const userVal = document.getElementById('login-username')?.value;
    const passVal = document.getElementById('login-password')?.value;

    if (userVal === adminConfig.username && passVal === adminConfig.password) {
        isAdminLoggedIn = true;
        localStorage.setItem('zdh_admin_session', 'true');
        closeAdminLoginModal();
        updateAdminUIState();
        renderMarketplace();
        renderReviews();
        openAdminDashboardModal();
        alert('Welcome Master Admin Zubair! Full Fameswap-Style Master Dashboard is now active.');
    } else {
        alert('Invalid Admin Username or Password. Please try again.');
    }
}

// Admin Wallet Addresses & Exchange Rate Submission
function handleAdminWalletSubmit(e) {
    e.preventDefault();

    paymentMethods.jazzcash = document.getElementById('wallet-jazzcash')?.value || paymentMethods.jazzcash;
    paymentMethods.easypaisa = document.getElementById('wallet-easypaisa')?.value || paymentMethods.easypaisa;
    paymentMethods.bankName = document.getElementById('wallet-bankname')?.value || paymentMethods.bankName;
    paymentMethods.bankAccount = document.getElementById('wallet-bankacc')?.value || paymentMethods.bankAccount;
    paymentMethods.usdtWallet = document.getElementById('wallet-usdt')?.value || paymentMethods.usdtWallet;
    paymentMethods.binancePayId = document.getElementById('wallet-binance')?.value || paymentMethods.binancePayId;
    paymentMethods.exchangeRate = parseFloat(document.getElementById('wallet-usdt-rate')?.value || '280');

    localStorage.setItem('zdh_payment_methods', JSON.stringify(paymentMethods));
    renderMarketplace();
    alert('Payment methods & USDT exchange rate updated successfully!');
}

// Admin Password Update Handler
function handleAdminCredSubmit(e) {
    e.preventDefault();

    const newUsername = document.getElementById('new-username')?.value;
    const newPassword = document.getElementById('new-password')?.value;

    if (!newUsername || !newPassword) {
        alert('Please enter valid new credentials.');
        return;
    }

    adminConfig.username = newUsername;
    adminConfig.password = newPassword;
    localStorage.setItem('zdh_admin_config', JSON.stringify(adminConfig));

    alert('Master Admin credentials updated successfully! Remember your new login info.');
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.removeItem('zdh_admin_session');
    closeAdminDashboardModal();
    updateAdminUIState();
    renderMarketplace();
    renderReviews();
    alert('Logged out from Admin session.');
}

function openAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function openAdminDashboardModal() {
    if (!isAdminLoggedIn) {
        openAdminLoginModal();
        return;
    }

    renderAdminDashboardContent();

    const modal = document.getElementById('admin-dashboard-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('block');
    }
}

function closeAdminDashboardModal() {
    const modal = document.getElementById('admin-dashboard-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('block');
    }
}

// Open Payment Info Modal for Buyers
function openPaymentInfoModal() {
    const modal = document.getElementById('payment-info-modal');
    const content = document.getElementById('payment-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="space-y-4">
            <div class="bg-slate-900 p-4 rounded-2xl border border-amber-500/40">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-qrcode text-amber-400"></i> Binance Pay Instant Transfer
                    </span>
                    <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">1 USDT = ${paymentMethods.exchangeRate || 280} PKR</span>
                </div>
                <div class="space-y-1.5 text-xs">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Binance Account Name:</span>
                        <strong class="text-white font-mono">zubair zubi001</strong>
                    </div>
                    <div class="flex justify-between pt-1 border-t border-white/10">
                        <span class="text-gray-400">Binance Pay ID:</span>
                        <strong class="text-amber-400 font-mono text-sm">82187140</strong>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900 p-4 rounded-2xl border border-emerald-500/30">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-coins"></i> USDT (TRC20 Wallet Address)
                    </span>
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">TRC20 Network</span>
                </div>
                <p class="text-xs font-mono text-emerald-400 font-bold bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 break-all select-all">
                    ${paymentMethods.usdtWallet}
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="bg-slate-900 p-3.5 rounded-2xl border border-red-500/30">
                    <span class="text-xs font-bold text-red-400 block mb-1">JazzCash (Local)</span>
                    <p class="text-xs text-white font-bold font-mono">${paymentMethods.jazzcash}</p>
                </div>
                <div class="bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/30">
                    <span class="text-xs font-bold text-emerald-400 block mb-1">EasyPaisa (Local)</span>
                    <p class="text-xs text-white font-bold font-mono">${paymentMethods.easypaisa}</p>
                </div>
            </div>

            <div class="bg-slate-900 p-4 rounded-2xl border border-cyan-500/30">
                <span class="text-xs font-bold text-cyan-400 block mb-1">Bank Account Wire / IBAN</span>
                <p class="text-xs text-white font-bold">${paymentMethods.bankName}</p>
                <p class="text-xs text-gray-300 font-mono mt-0.5">${paymentMethods.bankAccount}</p>
            </div>

            <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                🛡️ <strong>Escrow Protection Notice:</strong> Always confirm payment with Zubair Digital Hub Admin on WhatsApp before depositing.
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePaymentInfoModal() {
    const modal = document.getElementById('payment-info-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Render Content Inside Fameswap-Style Admin Dashboard
function renderAdminDashboardContent() {
    const dashListingsStat = document.getElementById('dash-stat-listings-count');
    const listingsTable = document.getElementById('admin-listings-table');
    const reviewsTable = document.getElementById('admin-reviews-table');

    if (dashListingsStat) {
        dashListingsStat.innerText = allListings.length;
    }

    // Populate Wallet Address Form Fields
    if (document.getElementById('wallet-jazzcash')) document.getElementById('wallet-jazzcash').value = paymentMethods.jazzcash || '';
    if (document.getElementById('wallet-easypaisa')) document.getElementById('wallet-easypaisa').value = paymentMethods.easypaisa || '';
    if (document.getElementById('wallet-bankname')) document.getElementById('wallet-bankname').value = paymentMethods.bankName || '';
    if (document.getElementById('wallet-bankacc')) document.getElementById('wallet-bankacc').value = paymentMethods.bankAccount || '';
    if (document.getElementById('wallet-usdt')) document.getElementById('wallet-usdt').value = paymentMethods.usdtWallet || '';
    if (document.getElementById('wallet-binance')) document.getElementById('wallet-binance').value = paymentMethods.binancePayId || '';
    if (document.getElementById('wallet-usdt-rate')) document.getElementById('wallet-usdt-rate').value = paymentMethods.exchangeRate || 280;

    // Populate Support Config Fields
    if (document.getElementById('admin-supp-phone')) document.getElementById('admin-supp-phone').value = supportConfig.supportPhone || '';
    if (document.getElementById('admin-supp-wa')) document.getElementById('admin-supp-wa').value = supportConfig.supportWhatsapp || '';
    if (document.getElementById('admin-supp-email')) document.getElementById('admin-supp-email').value = supportConfig.supportEmail || '';
    if (document.getElementById('admin-supp-hours')) document.getElementById('admin-supp-hours').value = supportConfig.supportHours || '';

    if (listingsTable) {
        listingsTable.innerHTML = allListings.map(item => `
            <tr class="border-b border-white/5 text-xs text-gray-300">
                <td class="py-3 px-2 font-bold text-white">${item.title}</td>
                <td class="py-3 px-2 uppercase font-semibold text-indigo-400">${item.platform}</td>
                <td class="py-3 px-2">${formatPrice(item.price)}</td>
                <td class="py-3 px-2 text-right">
                    <button onclick="adminDeleteListing('${item.id}')" class="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-bold">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    if (reviewsTable) {
        if (allReviews.length === 0) {
            reviewsTable.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-xs text-gray-500">No customer reviews yet.</td></tr>`;
        } else {
            reviewsTable.innerHTML = allReviews.map(rev => `
                <tr class="border-b border-white/5 text-xs text-gray-300">
                    <td class="py-3 px-2 font-bold text-white">${rev.name}</td>
                    <td class="py-3 px-2 text-amber-400 font-bold">${rev.rating} ★</td>
                    <td class="py-3 px-2 truncate max-w-xs">${rev.comment}</td>
                    <td class="py-3 px-2 text-right">
                        <button onclick="adminDeleteReview('${rev.id}')" class="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-bold">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// Delete Listing Action for Admin
function adminDeleteListing(listingId) {
    if (!confirm('Are you sure you want to delete this listing from Zubair Digital Hub?')) return;

    allListings = allListings.filter(l => l.id !== listingId);
    localStorage.setItem('zdh_listings', JSON.stringify(allListings));

    renderMarketplace();
    renderAdminDashboardContent();
}

// Delete Review Action for Admin
function adminDeleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this customer review?')) return;

    allReviews = allReviews.filter(r => r.id !== reviewId);
    localStorage.setItem('zdh_reviews', JSON.stringify(allReviews));

    renderReviews();
    renderAdminDashboardContent();
}

// Render Marketplace Grid
function renderMarketplace() {
    const grid = document.getElementById('listings-grid');
    if (!grid) return;

    const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();
    const monetizationVal = document.getElementById('monetization-filter')?.value || 'all';
    const priceVal = document.getElementById('price-filter')?.value || 'all';

    let filtered = allListings.filter(item => {
        if (currentPlatform !== 'all' && item.platform !== currentPlatform) return false;
        if (monetizationVal === 'monetized' && !item.monetized) return false;
        if (monetizationVal === 'non-monetized' && item.monetized) return false;

        const searchPool = `${item.title} ${item.niche} ${item.handle} ${item.platform} ${item.description}`.toLowerCase();
        if (searchVal && !searchPool.includes(searchVal)) return false;

        if (priceVal === 'under-50k' && item.price > 50000) return false;
        if (priceVal === '50k-150k' && (item.price < 50000 || item.price > 150000)) return false;
        if (priceVal === 'above-150k' && item.price < 150000) return false;

        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16 bg-[#101622] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="fa-solid fa-store-slash"></i>
                </div>
                <h3 class="text-xl font-extrabold text-white">No Active Account Listings Published Yet</h3>
                <p class="text-gray-400 text-xs mt-1 max-w-md mx-auto">Master Owner Zubair can publish real accounts directly from the Master Admin Panel.</p>
                <div class="mt-4 flex items-center justify-center gap-3">
                    <a href="admin.html" target="_blank" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> Add New Listing in Admin Panel
                    </a>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => createAccountCardHTML(item)).join('');
}

// Reset Search & Filters
function resetFilters() {
    const searchInput = document.getElementById('search-input');
    const monetizationFilter = document.getElementById('monetization-filter');
    const priceFilter = document.getElementById('price-filter');

    if (searchInput) searchInput.value = '';
    if (monetizationFilter) monetizationFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';

    renderMarketplace();
}

// Create Account Card HTML
function createAccountCardHTML(item) {
    const platformIcons = {
        youtube: 'fa-youtube text-red-500',
        facebook: 'fa-facebook text-blue-500',
        tiktok: 'fa-tiktok text-cyan-400',
        instagram: 'fa-instagram text-pink-500',
        twitter: 'fa-x-twitter text-blue-400'
    };

    const platformBadgeClasses = {
        youtube: 'badge-yt',
        facebook: 'badge-fb',
        tiktok: 'badge-tt',
        instagram: 'badge-ig',
        twitter: 'badge-tw'
    };

    const platformGradients = {
        youtube: 'from-red-950/80 via-red-900/40 to-slate-950 border-red-500/30 text-red-400',
        facebook: 'from-blue-950/80 via-blue-900/40 to-slate-950 border-blue-500/30 text-blue-400',
        tiktok: 'from-cyan-950/80 via-cyan-900/40 to-slate-950 border-cyan-500/30 text-cyan-400',
        instagram: 'from-pink-950/80 via-pink-900/40 to-slate-950 border-pink-500/30 text-pink-400',
        twitter: 'from-sky-950/80 via-sky-900/40 to-slate-950 border-sky-500/30 text-sky-400'
    };

    const iconClass = platformIcons[item.platform] || 'fa-globe text-indigo-400';
    const badgeClass = platformBadgeClasses[item.platform] || 'badge-yt';
    const gradientClass = platformGradients[item.platform] || 'from-indigo-950/80 via-indigo-900/40 to-slate-950 border-indigo-500/30 text-indigo-400';

    const hasScreenshots = item.screenshots && item.screenshots.length > 0;
    const coverImageSrc = hasScreenshots ? item.screenshots[0] : null;

    return `
        <div class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group relative border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl">
            <div>
                <!-- Top Cover Image / Proof Preview Banner (Clickable to open full details modal) -->
                <div onclick="openListingModal('${item.id}')" class="relative w-full aspect-[16/9] overflow-hidden bg-slate-950 cursor-pointer group/cover border-b border-white/10">
                    ${coverImageSrc ? `
                        <img src="${coverImageSrc}" alt="${item.title}" class="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                            <i class="fa-solid fa-magnifying-glass-plus text-amber-400 text-lg"></i> Click to View Screenshots & Details
                        </div>
                    ` : `
                        <div class="w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-4 relative overflow-hidden">
                            <i class="fa-brands ${iconClass} text-6xl opacity-20 absolute -bottom-2 -right-2"></i>
                            <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl mb-2 text-white shadow">
                                <i class="fa-brands ${iconClass}"></i>
                            </div>
                            <span class="text-xs font-bold text-white uppercase tracking-wider text-center line-clamp-1">${item.title}</span>
                            <span class="text-[10px] text-gray-300 font-mono mt-0.5">${item.handle}</span>
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                            <i class="fa-solid fa-eye text-indigo-400 text-lg"></i> View Listing Details
                        </div>
                    `}

                    <!-- Badges Overlay -->
                    <div class="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span class="px-2.5 py-1 text-[11px] font-bold rounded-full ${badgeClass} flex items-center gap-1.5 uppercase tracking-wider shadow-md">
                            <i class="fa-brands ${iconClass}"></i> ${item.platform}
                        </span>
                    </div>

                    <div class="absolute top-3 right-3 z-10">
                        ${item.monetized ? `
                            <span class="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 rounded-full flex items-center gap-1 shadow-md">
                                <i class="fa-solid fa-circle-check text-[10px]"></i> Monetized
                            </span>
                        ` : `
                            <span class="px-2.5 py-1 text-[10px] font-bold text-gray-300 bg-slate-900/90 border border-gray-700 rounded-full shadow-md">
                                Organic / Ready
                            </span>
                        `}
                    </div>
                </div>

                <!-- Card Content -->
                <div class="p-5">
                    <div onclick="openListingModal('${item.id}')" class="cursor-pointer">
                        <h3 class="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">${item.title}</h3>
                        <p class="text-xs text-gray-400 mt-0.5 font-mono flex items-center gap-2">
                            <span>${item.handle}</span>
                            <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span class="text-indigo-300 font-semibold">${item.niche}</span>
                        </p>
                    </div>

                    <!-- Metrics Grid -->
                    <div class="grid grid-cols-2 gap-2.5 my-3.5 bg-slate-900/80 p-3 rounded-xl border border-white/5">
                        <div>
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Followers / Subs</span>
                            <p class="text-sm font-black text-white mt-0.5">${item.followers}</p>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Monthly Rev</span>
                            <p class="text-xs font-bold text-emerald-400 mt-1 line-clamp-1">${item.monthlyRevenue}</p>
                        </div>
                    </div>

                    <!-- Visual Indicator Badges -->
                    <div class="flex items-center justify-between text-xs">
                        ${hasScreenshots ? `
                            <span onclick="openListingModal('${item.id}')" class="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5 hover:bg-amber-500/30 transition">
                                <i class="fa-solid fa-camera text-amber-400"></i> ${item.screenshots.length} Proof Screenshots
                            </span>
                        ` : `
                            <span class="text-[10px] font-semibold text-gray-400 inline-flex items-center gap-1">
                                <i class="fa-solid fa-shield-check text-emerald-400"></i> Escrow Verified
                            </span>
                        `}
                        <button onclick="openListingModal('${item.id}')" class="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            Full Proof & Details <i class="fa-solid fa-arrow-right text-[9px]"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer Action Bar -->
            <div class="p-4 border-t border-white/5 bg-slate-950/60 flex items-center justify-between">
                <div>
                    <span class="text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Price (${currentCurrency})</span>
                    <span class="text-base font-black ${currentCurrency === 'USDT' ? 'text-emerald-400' : 'text-white'}">${formatPrice(item.price)}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="openDirectDMModal('${item.id}')" title="Direct DM / Contact Owner" class="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1">
                        <i class="fa-brands fa-whatsapp"></i> DM
                    </button>
                    <button onclick="openListingModal('${item.id}')" class="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition">
                        Details
                    </button>
                    <button onclick="buyViaEscrow('${item.id}')" class="px-3 py-1.5 btn-brand rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md">
                        <i class="fa-solid fa-shield-halved"></i> Buy
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render User Reviews below Products on 1st Page
function renderReviews() {
    const container = document.getElementById('reviews-grid');
    if (!container) return;

    let filtered = allReviews;
    if (currentPlatform !== 'all') {
        filtered = allReviews.filter(r => r.platform === currentPlatform || r.platform === 'all');
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-10 bg-slate-900/60 rounded-2xl border border-white/5">
                <i class="fa-solid fa-star-half-stroke text-4xl text-amber-400/50 mb-3"></i>
                <h4 class="text-base font-bold text-white">No Customer Reviews Yet</h4>
                <p class="text-xs text-gray-400 mt-1">Real buyer reviews will be displayed here after deal completions. Be the first to submit!</p>
                <button onclick="openReviewModal()" class="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow">Write a Customer Review</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(rev => {
        const stars = Array.from({ length: 5 }, (_, i) => 
            `<i class="fa-solid fa-star ${i < rev.rating ? 'text-amber-400' : 'text-gray-600'}"></i>`
        ).join('');

        const platformBadgeClass = {
            youtube: 'text-red-400 bg-red-500/10 border-red-500/20',
            facebook: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            tiktok: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
            instagram: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
            twitter: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
        }[rev.platform] || 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

        return `
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                ${isAdminLoggedIn ? `
                    <button onclick="adminDeleteReview('${rev.id}')" title="Delete Review (Admin Only)" class="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-[10px] transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                ` : ''}

                <div>
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full btn-brand flex items-center justify-center font-bold text-white text-sm shadow">
                                ${rev.name.charAt(0)}
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
                                    ${rev.name}
                                    ${rev.verifiedBuyer ? `<span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>` : ''}
                                </h4>
                                <p class="text-[11px] text-gray-400">${rev.city || 'Verified Buyer'} • ${rev.date || 'Recently'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                        <div class="flex gap-1 text-xs">${stars}</div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${platformBadgeClass}">
                            ${rev.platform}
                        </span>
                    </div>

                    <p class="text-xs font-bold text-indigo-300 mb-2">
                        <i class="fa-solid fa-bag-shopping text-[10px] mr-1"></i> ${rev.serviceOrAccount}
                    </p>

                    <p class="text-xs text-gray-300 leading-relaxed italic">"${rev.comment}"</p>
                </div>
            </div>
        `;
    }).join('');
}

// Handle Submit Review Form
function handleReviewSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('rev-name')?.value.trim();
    const city = document.getElementById('rev-city')?.value.trim() || 'Global';
    const platform = document.getElementById('rev-platform')?.value || 'youtube';
    const serviceOrAccount = document.getElementById('rev-item')?.value.trim();
    const rating = parseInt(document.getElementById('rev-rating')?.value || '5');
    const comment = document.getElementById('rev-comment')?.value.trim();

    if (!name || !platform || !serviceOrAccount || !comment) {
        alert('Please complete all required fields for your review.');
        return;
    }

    const newReview = {
        id: `rev-${Date.now()}`,
        name,
        city,
        platform,
        serviceOrAccount,
        rating,
        date: "Just now",
        comment,
        verifiedBuyer: true
    };

    if (!allReviews) allReviews = [];
    allReviews.unshift(newReview);
    localStorage.setItem('zdh_reviews', JSON.stringify(allReviews));

    closeReviewModal();
    renderReviews();

    const revForm = document.getElementById('add-review-form');
    if (revForm) revForm.reset();

    alert('🎉 THANK YOU! Your customer review is now published live & sent to the Master Admin Panel!');
}

// Handle Client Support Ticket Form Submission (Linked to Admin Panel Inquiries)
function handleSupportTicketSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('ticket-name')?.value.trim() || 'Client';
    const phone = document.getElementById('ticket-phone')?.value.trim() || 'N/A';
    const issueType = document.getElementById('ticket-issue-type')?.value || 'Support Ticket';
    const msg = document.getElementById('ticket-message')?.value.trim() || '';

    if (!name || !phone || !msg) {
        alert('Please complete all required fields for your support ticket.');
        return;
    }

    const newInquiry = {
        id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
        clientName: name,
        phoneWhatsapp: phone,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@client.com`,
        accountInterested: `Support Ticket: ${issueType}`,
        offeredAmount: 'Help Desk Ticket',
        messageText: msg,
        date: 'Just now',
        status: 'Unread Support Ticket'
    };

    const inquiries = JSON.parse(localStorage.getItem('zdh_inquiries') || '[]');
    inquiries.unshift(newInquiry);
    localStorage.setItem('zdh_inquiries', JSON.stringify(inquiries));
    if (window.allInquiries) window.allInquiries = inquiries;

    closeSupportModal();
    const ticketForm = document.getElementById('support-ticket-form');
    if (ticketForm) ticketForm.reset();

    alert(`📩 SUPPORT TICKET DELIVERED TO MASTER ADMIN PANEL!\n\nThank you ${name}.\n\nYour support ticket regarding "${issueType}" has been received by Master Owner Zubair.`);
}

function sendSupportWhatsApp() {
    const name = document.getElementById('ticket-name')?.value.trim() || 'Client';
    const phone = document.getElementById('ticket-phone')?.value.trim() || 'N/A';
    const issueType = document.getElementById('ticket-issue-type')?.value || 'Support Ticket';
    const msg = document.getElementById('ticket-message')?.value.trim() || '';

    const text = `Hello Zubair Digital Hub Support Desk!\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `📌 *Category:* ${issueType}\n` +
        `💬 *Problem/Query:* ${msg}\n\n` +
        `Please assist me as soon as possible.`;

    window.open(`https://wa.me/${(supportConfig.supportWhatsapp || '').replace(/[^0-9]/g, '') || '923023632638'}?text=${encodeURIComponent(text)}`, '_blank');
}

function sendSupportGmail() {
    const name = document.getElementById('ticket-name')?.value.trim() || 'Client';
    const phone = document.getElementById('ticket-phone')?.value.trim() || 'N/A';
    const issueType = document.getElementById('ticket-issue-type')?.value || 'Support Ticket';
    const msg = document.getElementById('ticket-message')?.value.trim() || '';

    const subject = encodeURIComponent(`Client Support Ticket: ${issueType}`);
    const body = encodeURIComponent(
        `Hello Zubair Digital Hub Support Desk,\n\n` +
        `Name: ${name}\n` +
        `Phone/WhatsApp: ${phone}\n` +
        `Category: ${issueType}\n\n` +
        `Details / Problem Description:\n${msg}\n\n` +
        `Please assist me as soon as possible.`
    );

    const email = (supportConfig && supportConfig.supportEmail) || 'support@zubairdigitalhub.com';
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
}

function openReviewModal() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Detailed View Modal Logic
function openListingModal(listingId) {
    const item = allListings.find(l => l.id === listingId);
    if (!item) return;

    const modal = document.getElementById('listing-modal');
    const modalContent = document.getElementById('modal-content-area');
    if (!modal || !modalContent) return;

    const featuresList = (item.features || []).map(f => `<li class="flex items-center gap-2 text-sm text-gray-300"><i class="fa-solid fa-check text-emerald-400 text-xs"></i> ${f}</li>`).join('');

    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <span class="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    ${item.platform} Marketplace
                </span>
                <h2 class="text-2xl font-extrabold text-white mt-2">${item.title}</h2>
                <p class="text-sm font-mono text-indigo-400">${item.handle} • ${item.niche}</p>
            </div>
            <button onclick="closeListingModal()" class="text-gray-400 hover:text-white p-2 text-xl">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
            <div class="bg-gray-900/80 p-3.5 rounded-xl border border-white/10">
                <span class="text-xs text-gray-400">Subscribers / Audience</span>
                <p class="text-lg font-extrabold text-white mt-1">${item.followers}</p>
            </div>
            <div class="bg-gray-900/80 p-3.5 rounded-xl border border-white/10">
                <span class="text-xs text-gray-400">Monetization</span>
                <p class="text-sm font-bold text-emerald-400 mt-1">${item.monetized ? 'Active Monetized' : 'Non-Monetized'}</p>
            </div>
            <div class="bg-gray-900/80 p-3.5 rounded-xl border border-white/10">
                <span class="text-xs text-gray-400">Monthly Revenue</span>
                <p class="text-sm font-bold text-cyan-400 mt-1">${item.monthlyRevenue}</p>
            </div>
            <div class="bg-gray-900/80 p-3.5 rounded-xl border border-white/10">
                <span class="text-xs text-gray-400">Verified Seller</span>
                <p class="text-sm font-bold text-emerald-400 mt-1"><i class="fa-solid fa-shield-check"></i> Escrow Protected</p>
            </div>
        </div>

        <div class="mb-6">
            <h4 class="text-sm font-bold text-gray-200 uppercase tracking-wider mb-2">Description & History</h4>
            <p class="text-sm text-gray-300 leading-relaxed bg-gray-900/40 p-4 rounded-xl border border-white/5">${item.description}</p>
        </div>

        ${item.screenshots && item.screenshots.length > 0 ? `
            <div class="mb-6">
                <h4 class="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-camera text-amber-400"></i> Proof Screenshots & Analytics (${item.screenshots.length} Screenshots)
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-900/40 p-4 rounded-xl border border-white/5">
                    ${item.screenshots.map((src, idx) => `
                        <div onclick="viewFullImageModal('${src}')" class="relative cursor-pointer group overflow-hidden rounded-xl border border-white/10 aspect-video bg-slate-950 flex items-center justify-center shadow">
                            <img src="${src}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Proof Screenshot #${idx + 1}">
                            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                                <i class="fa-solid fa-magnifying-glass-plus text-lg text-amber-400 mr-1"></i> View High-Res
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <div class="mb-6">
            <h4 class="text-sm font-bold text-gray-200 uppercase tracking-wider mb-2">Account Highlights & Guarantees</h4>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-900/40 p-4 rounded-xl border border-white/5">
                ${featuresList}
            </ul>
        </div>

        <div class="flex items-center justify-between border-t border-white/10 pt-5 mt-6">
            <div>
                <span class="text-xs text-gray-400 block">Total Escrow Price (${currentCurrency})</span>
                <span class="text-2xl font-extrabold text-white">${formatPrice(item.price)}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="openDirectDMModal('${item.id}')" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
                    <i class="fa-brands fa-whatsapp text-sm"></i> Direct DM Owner
                </button>
                <button onclick="closeListingModal()" class="px-3.5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-semibold text-gray-300">Close</button>
                <button onclick="buyViaEscrow('${item.id}')" class="px-5 py-2.5 btn-brand rounded-xl text-xs font-bold flex items-center gap-2">
                    <i class="fa-solid fa-shield-halved"></i> Deal via Escrow
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeListingModal() {
    const modal = document.getElementById('listing-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function viewFullImageModal(src) {
    const modal = document.getElementById('proof-image-lightbox-modal');
    const img = document.getElementById('lightbox-full-img');
    if (img) img.src = src;
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeFullImageModal() {
    const modal = document.getElementById('proof-image-lightbox-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Direct DM Modal Logic & Handlers
function selectDMOption(mode) {
    const waBtn = document.getElementById('dm-choice-wa-btn');
    const siteBtn = document.getElementById('dm-choice-site-btn');
    const waArea = document.getElementById('dm-wa-submit-area');
    const siteArea = document.getElementById('dm-site-submit-area');
    const selectedMode = document.getElementById('dm-selected-mode');

    if (selectedMode) selectedMode.value = mode;

    if (mode === 'whatsapp') {
        if (waBtn) waBtn.className = "py-2.5 px-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-1.5 transition";
        if (siteBtn) siteBtn.className = "py-2.5 px-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition";
        if (waArea) waArea.style.display = 'block';
        if (siteArea) siteArea.style.display = 'none';
    } else {
        if (siteBtn) siteBtn.className = "py-2.5 px-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center justify-center gap-1.5 transition";
        if (waBtn) waBtn.className = "py-2.5 px-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition";
        if (waArea) waArea.style.display = 'none';
        if (siteArea) siteArea.style.display = 'block';
    }
}

function openDirectDMModal(listingId) {
    const item = allListings.find(l => l.id === listingId);
    if (!item) return;

    const modal = document.getElementById('direct-dm-modal');
    if (!modal) return;

    const targetTitle = document.getElementById('dm-target-item-title');
    const targetLink = document.getElementById('dm-target-item-link');
    const listingIdInput = document.getElementById('dm-listing-id');
    const msgText = document.getElementById('dm-buyer-msg');

    const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
    const pathname = window.location.pathname || 'index.html';
    const listingDirectUrl = `${origin}${pathname}#${item.id}`;

    if (targetTitle) targetTitle.innerText = `${item.title} (${item.handle})`;
    if (targetLink) targetLink.innerText = `🔗 ${listingDirectUrl}`;
    if (listingIdInput) listingIdInput.value = item.id;

    if (msgText) {
        msgText.value = `AOA Zubair Digital Hub Master Owner,\n\n` +
            `I am interested in buying listing: ${item.title}\n` +
            `🔗 Direct Listing Link: ${listingDirectUrl}\n` +
            `💰 Listing Price: ${formatPrice(item.price)}\n\n` +
            `Please guide me on how to proceed with Escrow payment and transfer.`;
    }

    selectDMOption('website');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeDirectDMModal() {
    const modal = document.getElementById('direct-dm-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function sendWhatsAppDM() {
    const listingId = document.getElementById('dm-listing-id')?.value;
    const name = document.getElementById('dm-buyer-name')?.value || 'Buyer';
    const msg = document.getElementById('dm-buyer-msg')?.value || '';

    const item = allListings.find(l => l.id === listingId);
    const itemTitle = item ? item.title : 'Listing Inquiry';
    const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
    const pathname = window.location.pathname || 'index.html';
    const listingDirectUrl = item ? `${origin}${pathname}#${item.id}` : window.location.href;

    const fullMsg = `Hello Zubair Digital Hub Master Owner!\n\n` +
        `👤 *Buyer Name:* ${name}\n` +
        `📺 *Interested Listing:* ${itemTitle}\n` +
        `🔗 *Direct Website Link:* ${listingDirectUrl}\n\n` +
        `💬 *Message / Offer:* ${msg}\n\n` +
        `Please confirm escrow availability.`;

    const encoded = encodeURIComponent(fullMsg);
    window.open(`https://wa.me/${(supportConfig.supportWhatsapp || '').replace(/[^0-9]/g, '') || '923023632638'}?text=${encoded}`, '_blank');
}

function sendGmailDM() {
    const listingId = document.getElementById('dm-listing-id')?.value;
    const name = document.getElementById('dm-buyer-name')?.value || 'Buyer';
    const msg = document.getElementById('dm-buyer-msg')?.value || '';

    const item = allListings.find(l => l.id === listingId);
    const itemTitle = item ? item.title : 'Listing Inquiry';
    const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
    const pathname = window.location.pathname || 'index.html';
    const listingDirectUrl = item ? `${origin}${pathname}#${item.id}` : window.location.href;

    const subject = encodeURIComponent(`Listing Offer / Inquiry: ${itemTitle}`);
    const body = encodeURIComponent(
        `Hello Zubair Digital Hub Master Owner,\n\n` +
        `Buyer Name: ${name}\n` +
        `Interested Account: ${itemTitle}\n` +
        `Direct Link: ${listingDirectUrl}\n\n` +
        `Message / Custom Offer:\n${msg}\n\n` +
        `Best regards,\n${name}`
    );

    const email = (supportConfig && supportConfig.supportEmail) || 'support@zubairdigitalhub.com';
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
}

// Redirect to Dedicated Checkout & Escrow Terms Page
function buyViaEscrow(listingId) {
    window.location.href = `checkout.html?id=${listingId}`;
}

// Open & Close Services Drawer Modal
function openServicesModal(platform = 'all') {
    renderServices(platform);
    const modal = document.getElementById('services-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
    }
}

function closeServicesModal() {
    const modal = document.getElementById('services-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.display = 'none';
    }
}

// Render Platform SMM Growth Services
function renderServices(platform = 'all') {
    const modalContainer = document.getElementById('services-container');
    const homeContainer = document.getElementById('homepage-services-container');

    if (!allServices || allServices.length === 0) {
        loadServices();
    }

    let servicesToDisplay = allServices;
    if (platform !== 'all') {
        servicesToDisplay = allServices.filter(s => s.platform === platform);
    }

    if (servicesToDisplay.length === 0) {
        const emptyMsg = `<p class="col-span-full text-gray-400 text-center py-8 text-xs font-mono">No active services for this platform category.</p>`;
        if (modalContainer) modalContainer.innerHTML = emptyMsg;
        if (homeContainer) homeContainer.innerHTML = emptyMsg;
        return;
    }

    const cardsHTML = servicesToDisplay.map(srv => {
        const pkrText = `PKR ${srv.pricePKR.toLocaleString()}`;
        const usdText = `$ ${srv.priceUSD.toLocaleString()} USDT`;
        const activePriceText = currentCurrency === 'USDT' || currentCurrency === 'USD' ? usdText : pkrText;

        const platformBadgeClasses = {
            youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
            facebook: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            tiktok: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            twitter: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
        }[srv.platform] || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';

        return `
            <div class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-purple-500/40 transition group shadow-xl cursor-pointer" onclick="openServiceDetailModal('${srv.id}')">
                <div>
                    <!-- Matching Image Banner -->
                    <div class="relative w-full aspect-video bg-slate-950 overflow-hidden border-b border-white/10">
                        <img src="${srv.image || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'}" alt="${srv.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                        <div class="absolute top-2.5 left-2.5">
                            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${platformBadgeClasses}">
                                ${srv.platform} Service
                            </span>
                        </div>
                        <div class="absolute top-2.5 right-2.5">
                            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ${srv.rating || '5.0 ★'}
                            </span>
                        </div>
                    </div>

                    <div class="p-4">
                        <h4 class="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-1.5">${srv.name}</h4>
                        <p class="text-[11px] text-emerald-400 font-semibold mb-3 flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check text-[10px]"></i> ${srv.guarantee}
                        </p>
                        <div class="text-[11px] text-gray-400 flex justify-between bg-slate-900/80 p-2 rounded-xl border border-white/5">
                            <span>Est. Delivery:</span>
                            <span class="text-white font-bold">${srv.delivery}</span>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-white/5 bg-slate-950/60 flex items-center justify-between gap-2" onclick="event.stopPropagation()">
                    <div>
                        <span class="text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Package Rates (PKR / USD)</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-xs font-black ${currentCurrency === 'PKR' ? 'text-white underline decoration-indigo-500' : 'text-gray-300'}">${pkrText}</span>
                            <span class="text-[10px] text-gray-500 font-bold">•</span>
                            <span class="text-xs font-black font-mono ${currentCurrency === 'USDT' ? 'text-emerald-400 underline decoration-emerald-500' : 'text-emerald-400/80'}">${usdText}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button onclick="openServiceDetailModal('${srv.id}')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold rounded-xl transition border border-purple-500/30 flex items-center gap-1" title="View Full Details">
                            <i class="fa-solid fa-circle-info"></i> Details
                        </button>
                        <button onclick="orderService('${srv.name}', '${activePriceText} (${pkrText} / ${usdText})')" class="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1">
                            <i class="fa-brands fa-whatsapp text-sm"></i> Order
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (modalContainer) modalContainer.innerHTML = cardsHTML;
    if (homeContainer) homeContainer.innerHTML = cardsHTML;
}

// Open & Close Individual Service Detail Modal
function openServiceDetailModal(serviceId) {
    const srv = allServices.find(s => s.id === serviceId);
    if (!srv) return;

    const modal = document.getElementById('service-detail-modal');
    if (!modal) return;

    const imgElem = document.getElementById('sd-image');
    const titleElem = document.getElementById('sd-title');
    const guaranteeElem = document.getElementById('sd-guarantee');
    const pkrElem = document.getElementById('sd-price-pkr');
    const usdElem = document.getElementById('sd-price-usd');
    const deliveryElem = document.getElementById('sd-delivery');
    const platformBadge = document.getElementById('sd-platform-badge');
    const ratingBadge = document.getElementById('sd-rating-badge');
    const waBtn = document.getElementById('sd-order-wa-btn');
    const inquiryBtn = document.getElementById('sd-order-inquiry-btn');

    if (imgElem) imgElem.src = srv.image || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80';
    if (titleElem) titleElem.innerText = srv.name;
    if (guaranteeElem) guaranteeElem.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-400"></i> ${srv.guarantee}`;
    if (pkrElem) pkrElem.innerText = `PKR ${srv.pricePKR.toLocaleString()}`;
    if (usdElem) usdElem.innerText = `$ ${srv.priceUSD.toLocaleString()} USDT`;
    if (deliveryElem) deliveryElem.innerText = srv.delivery;
    if (platformBadge) platformBadge.innerText = `${srv.platform.toUpperCase()} SERVICE`;
    if (ratingBadge) ratingBadge.innerText = `${srv.rating || '5.0 ★'} Rating`;

    const activePriceText = `PKR ${srv.pricePKR.toLocaleString()} / $ ${srv.priceUSD.toLocaleString()} USDT`;

    if (waBtn) {
        waBtn.onclick = () => orderService(srv.name, activePriceText);
    }
    if (inquiryBtn) {
        inquiryBtn.onclick = () => {
            closeServiceDetailModal();
            openSupportModal();
        };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.style.display = 'flex';
}

function closeServiceDetailModal() {
    const modal = document.getElementById('service-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.display = 'none';
    }
}

// Order SMM Service via WhatsApp
function orderService(serviceName, price) {
    const msg = `Hello Zubair Digital Hub! I want to order this SMM Service:\n\n` +
        `📦 *Service:* ${serviceName}\n` +
        `💵 *Price:* ${price}\n\n` +
        `Please guide me on how to proceed.`;
    window.open(`https://wa.me/${(supportConfig.supportWhatsapp || '').replace(/[^0-9]/g, '') || '18005550199'}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Handle "List Account for Sale" Form Submission
function handleSellFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('sell-title')?.value;
    const platform = document.getElementById('sell-platform')?.value;
    const handle = document.getElementById('sell-handle')?.value;
    const followers = document.getElementById('sell-followers')?.value;
    const niche = document.getElementById('sell-niche')?.value;
    const price = parseFloat(document.getElementById('sell-price')?.value || 0);
    const monetized = document.getElementById('sell-monetized')?.value === 'true';
    const description = document.getElementById('sell-desc')?.value;
    const contact = document.getElementById('sell-contact')?.value;

    if (!title || !platform || !handle || !price || !contact) {
        alert('Please fill out all required fields.');
        return;
    }

    const newListing = {
        id: `custom-${Date.now()}`,
        title,
        platform,
        handle,
        followers: followers || 'N/A',
        followersCount: parseInt(followers.replace(/,/g, '')) || 0,
        monetized,
        niche: niche || 'General',
        monthlyRevenue: 'Contact Seller',
        price,
        currency: 'PKR',
        badge: monetized ? 'Monetized' : 'Verified Listing',
        verified: false,
        description: description || 'No extra description provided.',
        features: ['Escrow Protection Guaranteed', 'Direct Seller Handover'],
        sellerContact: contact
    };

    allListings.unshift(newListing);
    localStorage.setItem('zdh_listings', JSON.stringify(allListings));

    // Also push seller submission to inquiries log for Admin Panel alerts
    const newInquiry = {
        id: `SEL-${Math.floor(100 + Math.random() * 900)}`,
        clientName: `Seller (${contact})`,
        phoneWhatsapp: contact,
        email: `seller@zubairdigitalhub.com`,
        accountInterested: `Seller Proposal: ${title} (${handle})`,
        offeredAmount: formatPrice(price),
        messageText: description || `Platform: ${platform.toUpperCase()} | Subs/Followers: ${followers || 'N/A'}`,
        date: 'Just now',
        status: 'Unread Seller Submission'
    };

    const inquiries = JSON.parse(localStorage.getItem('zdh_inquiries') || '[]');
    inquiries.unshift(newInquiry);
    localStorage.setItem('zdh_inquiries', JSON.stringify(inquiries));
    if (window.allInquiries) window.allInquiries = inquiries;

    closeSellModal();
    renderMarketplace();

    alert(`🚀 LISTING PROPOSAL DELIVERED DIRECTLY TO MASTER ADMIN PANEL INBOX!\n\nTitle: ${title}\nPlatform: ${platform.toUpperCase()}\nPrice: PKR ${price.toLocaleString()}\n\nMaster Owner Zubair has received your submission in his Admin Panel Inbox.`);
}

function openSellModal() {
    const modal = document.getElementById('sell-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeSellModal() {
    const modal = document.getElementById('sell-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Escrow Calculator Logic
function initEscrowCalculator() {
    const amountInput = document.getElementById('escrow-calc-amount');
    if (!amountInput) return;

    amountInput.addEventListener('input', calculateEscrowFee);
    calculateEscrowFee();
}

function calculateEscrowFee() {
    const input = document.getElementById('escrow-calc-amount');
    const displayFee = document.getElementById('escrow-fee-display');
    const displayTotal = document.getElementById('escrow-total-display');

    if (!input || !displayFee || !displayTotal) return;

    const amount = parseFloat(input.value) || 0;
    let feeRate = 0.05;

    if (amount > 200000) feeRate = 0.03;
    else if (amount > 100000) feeRate = 0.04;

    const fee = amount * feeRate;
    const total = amount + fee;

    displayFee.innerText = formatPrice(fee);
    displayTotal.innerText = formatPrice(total);
}
