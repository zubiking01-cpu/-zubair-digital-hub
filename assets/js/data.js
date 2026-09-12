// Initial dataset for Zubair Digital Hub marketplace listings, SMM services, user reviews, payment methods, support config, and admin settings

const defaultAdminConfig = {
    username: "zubair",
    password: "zubair123",
    role: "Master Admin",
    ownerName: "Zubair Digital Hub Owner"
};

const defaultSupportConfig = {
    supportPhone: "+92 302 3632638",
    supportWhatsapp: "+92 302 3632638",
    supportEmail: "support@zubairdigitalhub.com",
    supportHours: "24/7 Priority Escrow & Client Support",
    responseNotice: "Instant Response (Under 5 Minutes)"
};

const defaultPaymentMethods = {
    jazzcash: "+92 308 3727339 (Muhammad zubair zafar)",
    easypaisa: "+92 302 3632638 (Muhammad zubair zafar)",
    bankName: "United Bank Limited (UBL)",
    bankAccount: "PK24UNIL0109000378922612 (Zubair digital hub)",
    usdtWallet: "TMYEB4BvVxFi1AvrLZJsVP6JWm51BwzCvm",
    binancePayId: "82187140 (zubair zubi001)",
    exchangeRate: 280 // 1 USD = 280 PKR
};

const sampleListings = [];

const platformServices = {
    youtube: [
        { name: "YouTube 4,000 Hours Watch Time", delivery: "3-5 Days", pricePKR: "PKR 6,500", priceUSD: "$ 24 USD", rating: "5.0 ★", guarantee: "Non-Drop & Lifetime Guarantee" },
        { name: "YouTube 1,000 Monetization Subscribers", delivery: "2-4 Days", pricePKR: "PKR 4,200", priceUSD: "$ 15 USD", rating: "4.9 ★", guarantee: "Real & Non-Drop" },
        { name: "YouTube High RPM Organic Views (10,000 Views)", delivery: "24-48 Hours", pricePKR: "PKR 2,800", priceUSD: "$ 10 USD", rating: "4.9 ★", guarantee: "High Retention Traffic" },
        { name: "PIN Verified Google AdSense Account", delivery: "Instant Handover", pricePKR: "PKR 8,500", priceUSD: "$ 30 USD", rating: "5.0 ★", guarantee: "Identity & Address Verified" },
        { name: "Complete YouTube Channel Monetization Package", delivery: "7 Days", pricePKR: "PKR 9,999", priceUSD: "$ 36 USD", rating: "5.0 ★", guarantee: "100% Monetization Approval" },
        { name: "YouTube Shorts 10 Million Views Booster", delivery: "5-7 Days", pricePKR: "PKR 8,900", priceUSD: "$ 32 USD", rating: "5.0 ★", guarantee: "Shorts Monetization Eligible" }
    ],
    facebook: [
        { name: "Facebook In-Stream Watch Time (60,000 Minutes)", delivery: "48 Hours", pricePKR: "PKR 4,500", priceUSD: "$ 16 USD", rating: "5.0 ★", guarantee: "100% Monetization Criteria Met" },
        { name: "Facebook Page Followers (10,000 Followers)", delivery: "2-3 Days", pricePKR: "PKR 3,500", priceUSD: "$ 13 USD", rating: "4.9 ★", guarantee: "Non-Drop Guaranteed" },
        { name: "Facebook Stars & Performance Bonus Approval", delivery: "3-4 Days", pricePKR: "PKR 5,500", priceUSD: "$ 20 USD", rating: "5.0 ★", guarantee: "Approved Payout Setup" },
        { name: "Facebook Group Members Boost (10,000 Members)", delivery: "3-4 Days", pricePKR: "PKR 4,000", priceUSD: "$ 15 USD", rating: "4.8 ★", guarantee: "Active Profiles" }
    ],
    tiktok: [
        { name: "TikTok Organic Followers (10,000 Followers)", delivery: "24-48 Hours", pricePKR: "PKR 3,200", priceUSD: "$ 12 USD", rating: "4.9 ★", guarantee: "Unlocks LIVE Streaming & Gifts" },
        { name: "TikTok USA / UK Region Creator Beta Rewards Account", delivery: "Instant", pricePKR: "PKR 3,500", priceUSD: "$ 13 USD", rating: "5.0 ★", guarantee: "100% Monetizable" },
        { name: "TikTok Video Views Booster (100,000 Viral Views)", delivery: "12-24 Hours", pricePKR: "PKR 1,500", priceUSD: "$ 6 USD", rating: "5.0 ★", guarantee: "FYP Algorithm Push" },
        { name: "TikTok Live Viewers & Likes Engagement Package", delivery: "Instant Live", pricePKR: "PKR 2,500", priceUSD: "$ 9 USD", rating: "4.8 ★", guarantee: "Real-Time Engagement" }
    ],
    instagram: [
        { name: "Instagram Real Followers (10,000 Followers)", delivery: "2-3 Days", pricePKR: "PKR 3,800", priceUSD: "$ 14 USD", rating: "4.9 ★", guarantee: "Lifetime Refill Guarantee" },
        { name: "Instagram Reel Viral Views Push (100,000 Views)", delivery: "Instant", pricePKR: "PKR 2,200", priceUSD: "$ 8 USD", rating: "4.9 ★", guarantee: "Explore Page Recommendation" },
        { name: "Instagram Meta Verified Blue Tick Setup Assistance", delivery: "24 Hours", pricePKR: "PKR 4,500", priceUSD: "$ 16 USD", rating: "5.0 ★", guarantee: "100% Verification Support" }
    ],
    twitter: [
        { name: "Twitter / X Monetization Impression Package (5M)", delivery: "3 Days", pricePKR: "PKR 7,500", priceUSD: "$ 27 USD", rating: "5.0 ★", guarantee: "X Creator Ad Revenue Sharing Eligible" },
        { name: "Twitter / X Premium Organic Followers (5,000 Followers)", delivery: "2-4 Days", pricePKR: "PKR 4,500", priceUSD: "$ 16 USD", rating: "4.8 ★", guarantee: "High Quality Active Accounts" }
    ]
};

const sampleDeals = [
    {
        id: "ESC-9082",
        buyerName: "Hamza Ali",
        buyerPhone: "+92 301 8899112",
        buyerEmail: "hamza.ali@gmail.com",
        itemTitle: "Gaming & Tech Channel (125K Subscribers)",
        platform: "youtube",
        dealAmountPKR: 245000,
        dealAmountUSDT: 875,
        status: "In Progress",
        daysRemaining: 2,
        estimatedTimeText: "48 Hours Remaining (Handover Verification)",
        progressPercent: 65,
        startDate: "2026-08-25",
        estCompletionDate: "2026-08-28",
        notes: "Buyer paid deposit via JazzCash. Email transfer pending primary owner verification."
    },
    {
        id: "ESC-9083",
        buyerName: "David Miller",
        buyerPhone: "+1 (415) 555-0192",
        buyerEmail: "david.miller@techcorp.com",
        itemTitle: "News & Trending Memes Facebook Page (210K Followers)",
        platform: "facebook",
        dealAmountPKR: 320000,
        dealAmountUSDT: 1140,
        status: "Verification Phase",
        daysRemaining: 1,
        estimatedTimeText: "24 Hours Remaining (In-Stream Admin Check)",
        progressPercent: 85,
        startDate: "2026-08-24",
        estCompletionDate: "2026-08-27",
        notes: "USDT TRC20 deposit confirmed ($1,140 USDT). Checking FB Admin role transfer."
    },
    {
        id: "ESC-9084",
        buyerName: "Usman Raza",
        buyerPhone: "+92 321 9988776",
        buyerEmail: "usman.raza@yahoo.com",
        itemTitle: "Automobile & Supercars TikTok Account (88K Followers)",
        platform: "tiktok",
        dealAmountPKR: 115000,
        dealAmountUSDT: 410,
        status: "Pending Escrow Deposit",
        daysRemaining: 3,
        estimatedTimeText: "3 Days Remaining (Awaiting EasyPaisa Transfer)",
        progressPercent: 20,
        startDate: "2026-08-26",
        estCompletionDate: "2026-08-29",
        notes: "Awaiting EasyPaisa payment receipt screenshot from buyer."
    },
    {
        id: "ESC-9080",
        buyerName: "Bilal Ahmad",
        buyerPhone: "+92 300 7766554",
        buyerEmail: "bilal.ahmad@outlook.com",
        itemTitle: "Motivational & Business IG Page (52K Followers)",
        platform: "instagram",
        dealAmountPKR: 42000,
        dealAmountUSDT: 150,
        status: "Completed",
        daysRemaining: 0,
        estimatedTimeText: "Completed & Funds Released",
        progressPercent: 100,
        startDate: "2026-08-20",
        estCompletionDate: "2026-08-22",
        notes: "Successfully transferred. Escrow funds released to owner."
    }
];

const sampleInquiries = [
    {
        id: "MSG-401",
        clientName: "Kamran Shah",
        phoneWhatsapp: "+92 321 4455667",
        email: "kamran.shah@gmail.com",
        accountInterested: "News & Trending Memes Facebook Page (210K Followers)",
        offeredAmount: "PKR 300,000",
        messageText: "AOA Zubair bhai, I want to buy this Facebook page via Escrow. Please guide how much time transfer takes.",
        date: "Aug 26, 2026 (10 mins ago)",
        status: "Unread / New"
    },
    {
        id: "MSG-402",
        clientName: "Shahid Malik",
        phoneWhatsapp: "+92 302 1122334",
        email: "shahid.malik@hotmail.com",
        accountInterested: "Gaming & Tech Channel (125K Subscribers)",
        offeredAmount: "PKR 230,000 ($820 USDT)",
        messageText: "Is AdSense included with the YouTube channel? I am ready to pay in USDT TRC20 today.",
        date: "Aug 26, 2026 (1 hour ago)",
        status: "In Discussion"
    },
    {
        id: "MSG-403",
        clientName: "Alex Turner",
        phoneWhatsapp: "+1 (312) 555-0144",
        email: "alex.turner@crypto.io",
        accountInterested: "Web3 & Tech Twitter / X Account (65K Followers)",
        offeredAmount: "$580 USDT",
        messageText: "Hello, I can pay $580 USDT via Binance Pay for the Twitter account. Please confirm escrow terms.",
        date: "Aug 26, 2026 (3 hours ago)",
        status: "Converted to Escrow"
    }
];

const sampleReviews = [];

let allDeals = [];
let allInquiries = [];

function loadDeals() {
    const saved = localStorage.getItem('zdh_deals');
    if (saved) {
        try { allDeals = JSON.parse(saved); } catch(e) { allDeals = [...sampleDeals]; }
    } else {
        allDeals = [...sampleDeals];
        localStorage.setItem('zdh_deals', JSON.stringify(allDeals));
    }
}

function loadInquiries() {
    const saved = localStorage.getItem('zdh_inquiries');
    if (saved) {
        try { allInquiries = JSON.parse(saved); } catch(e) { allInquiries = [...sampleInquiries]; }
    } else {
        allInquiries = [...sampleInquiries];
        localStorage.setItem('zdh_inquiries', JSON.stringify(allInquiries));
    }
}

