const uploadZone = document.getElementById('uploadZone');
const roomPhoto = document.getElementById('roomPhoto');
const previewImage = document.getElementById('previewImage');
const uploadPrompt = document.getElementById('uploadPrompt');
const designForm = document.getElementById('designForm');
const roomGoal = document.getElementById('roomGoal');
const roomType = document.getElementById('roomType');
const budget = document.getElementById('budget');
const emptyState = document.getElementById('emptyState');
const results = document.getElementById('results');
const resultTitle = document.getElementById('resultTitle');
const confidenceBadge = document.getElementById('confidenceBadge');
const sampleButton = document.getElementById('sampleButton');
const aiRoomContainer = document.getElementById('aiRoomContainer');
const aiRoomImage = document.getElementById('aiRoomImage');
const itemsContainer = document.getElementById('itemsContainer');
const itemsGrid = document.getElementById('itemsGrid');

const designProfiles = [
    {
        keys: ['study', 'office', 'work', 'productive', 'desk'],
        title: 'Calm Productivity Studio',
        palette: ['warm white', 'sage green', 'light oak', 'matte black'],
        layout: 'Place the desk near natural light, keep the camera-facing wall clean, and use vertical shelves to avoid crowding the floor.',
        furniture: 'Compact desk, ergonomic chair, floating shelves, cable tray, slim closed cabinet.',
        lighting: 'Add a focused desk lamp plus a warm floor lamp behind the chair to reduce screen glare.',
        decor: 'Use one large artwork, a pinboard, two plants, and matching storage boxes for a quiet professional look.'
    },
    {
        keys: ['gaming', 'stream', 'setup', 'pc', 'console'],
        title: 'Immersive Gaming Lounge',
        palette: ['charcoal', 'electric blue', 'deep purple', 'soft white'],
        layout: 'Create one hero wall for the monitor or TV, keep seating centered, and route cables behind the desk or media unit.',
        furniture: 'Wide desk, supportive gaming chair, acoustic panels, low media console, hidden cable channels.',
        lighting: 'Use dimmable RGB strips behind the desk and a soft overhead diffuser so the room does not feel harsh.',
        decor: 'Add framed game art, sound panels, collectibles on floating ledges, and a dark textured rug.'
    },
    {
        keys: ['cozy', 'relax', 'reading', 'guest', 'lounge'],
        title: 'Cozy Warm Retreat',
        palette: ['cream', 'terracotta', 'walnut', 'soft beige'],
        layout: 'Anchor the space with a rug, create a reading corner near the brightest wall, and leave a clear path from the door.',
        furniture: 'Comfort chair, small side table, layered rug, storage bench, soft curtains.',
        lighting: 'Use warm bulbs, a fabric-shade floor lamp, and small table lamps instead of relying only on ceiling light.',
        decor: 'Layer cushions, throws, ceramic vases, books, natural baskets, and warm-toned wall art.'
    },
    {
        keys: ['kid', 'kids', 'nursery', 'child', 'play'],
        title: 'Flexible Kids Activity Room',
        palette: ['soft white', 'pastel blue', 'sunny yellow', 'natural wood'],
        layout: 'Divide the room into sleep, study, and play zones while keeping the center open for movement.',
        furniture: 'Rounded-edge storage, washable rug, low bookshelves, study table, labeled toy bins.',
        lighting: 'Combine soft ceiling lighting with a task lamp and a gentle night light.',
        decor: 'Use removable wall decals, playful art, growth chart, and colorful but limited accents to avoid clutter.'
    },
    {
        keys: ['luxury', 'premium', 'hotel', 'elegant', 'modern'],
        title: 'Modern Boutique Interior',
        palette: ['greige', 'brass', 'espresso wood', 'ivory'],
        layout: 'Create symmetry around the main wall, hide visible storage, and use fewer larger statement pieces.',
        furniture: 'Upholstered headboard or sofa, brass side tables, full-height curtains, statement mirror, built-in style storage.',
        lighting: 'Install layered warm lighting with sconces, concealed LEDs, and a sculptural pendant if possible.',
        decor: 'Choose oversized art, textured cushions, stone trays, and a large rug for a polished hotel-like finish.'
    }
];

function chooseProfile(goal) {
    const normalizedGoal = goal.toLowerCase();
    return designProfiles.find(profile =>
        profile.keys.some(key => normalizedGoal.includes(key))
    ) || designProfiles[2];
}

function getBudgetAdvice(level) {
    if (level === 'Premium') {
        return 'Invest first in custom storage, quality lighting fixtures, full-height curtains, and one statement furniture piece that defines the room.';
    }
    if (level === 'Mid-range') {
        return 'Spend on durable core furniture, add affordable decor in the same palette, and upgrade lighting for the biggest visual impact.';
    }
    return 'Start with paint, decluttering, furniture rearrangement, thrifted side tables, peel-and-stick details, cushions, plants, and better bulbs.';
}

function createResultCard(icon, heading, content, delay, renderHtml = false) {
    const card = document.createElement('article');
    card.className = 'result-card soft-card rounded-3xl p-5';
    card.style.animationDelay = `${delay}ms`;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-4';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-teal-200';
    const iconElement = document.createElement('i');
    iconElement.className = icon;
    iconWrap.appendChild(iconElement);

    const body = document.createElement('div');
    const title = document.createElement('h4');
    title.className = 'font-extrabold text-white';
    title.textContent = heading;
    const text = document.createElement('p');
    text.className = 'mt-2 text-sm leading-6 text-slate-400';
    if (renderHtml) {
        text.innerHTML = content;
    } else {
        text.textContent = content;
    }

    body.append(title, text);
    wrapper.append(iconWrap, body);
    card.appendChild(wrapper);
    return card;
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'soft-card rounded-3xl overflow-hidden';
    card.innerHTML = `
        <img src="${item.image}" class="h-52 w-full object-cover" />
        <div class="p-5">
            <h4 class="font-extrabold text-lg">${item.name}</h4>
            <p class="text-sm text-slate-400 mt-2">${item.description}</p>
            <div class="mt-4 flex items-center justify-between">
                <span class="font-bold text-teal-200">${item.price}</span>
                <button class="btn-secondary px-4 py-2 rounded-xl text-sm">View</button>
            </div>
        </div>
    `;
    return card;
}

async function generateAIRoomDesign(imageFile, promptText) {
    // Pollinations.ai — 100% free, no API key, works forever!
    aiRoomContainer.classList.remove('hidden');
    aiRoomImage.classList.add('hidden');

    // Show loader
    let loader = document.getElementById('aiRoomLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'aiRoomLoader';
        loader.innerHTML = `
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:28px 20px;border-radius:1.5rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);">
                <div style="width:32px;height:32px;border:3px solid rgba(94,234,212,0.15);border-top-color:#5eead4;border-radius:50%;animation:spin 0.85s linear infinite;"></div>
                <p style="color:#94a3b8;font-size:0.82rem;font-weight:600;margin:0;">✨ Generating AI room design...</p>
            </div>
        `;
        aiRoomContainer.insertBefore(loader, aiRoomImage);
    } else {
        loader.style.display = 'block';
    }

    try {
        const seed = Math.floor(Math.random() * 999999);
        const encoded = encodeURIComponent(promptText);
        const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;

        // Load image directly — no server needed!
        await new Promise((resolve, reject) => {
            aiRoomImage.onload = resolve;
            aiRoomImage.onerror = reject;
            aiRoomImage.src = url;
        });

        loader.style.display = 'none';
        aiRoomImage.classList.remove('hidden');
        aiRoomImage.alt = 'AI redesigned room';

    } catch (error) {
        console.error('Pollinations error:', error);
        loader.style.display = 'none';
        aiRoomContainer.classList.add('hidden');
    }
}

function generatePlan(event) {
    event.preventDefault();
    const goal = roomGoal.value.trim();
    if (!goal) {
        roomGoal.focus();
        return;
    }

    const profile = chooseProfile(goal);
    const paletteText = profile.palette
        .map(color => `<span class="mr-2 mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">${color}</span>`)
        .join('');
    const roomContext = `For the current ${roomType.value.toLowerCase()}, focus every change on this purpose: "${goal}"`;

    // Update header
    resultTitle.textContent = profile.title;
    confidenceBadge.textContent = roomPhoto.files.length ? 'Photo added ✓' : 'Text plan';
    emptyState.classList.add('hidden');
    results.innerHTML = '';

    // Start AI image generation (non-blocking)
    const uploadedFile = roomPhoto.files[0];
    generateAIRoomDesign(
        uploadedFile,
        `Redesign this ${roomType.value} into a ${profile.title} style with ${profile.palette.join(', ')} colors. ${goal}`
    );

    // Show suggested items based on profile
    itemsContainer.classList.remove('hidden');
    itemsGrid.innerHTML = '';

    const itemsByProfile = {
        study: [
            { name: 'Ergonomic Study Chair', description: 'Lumbar support for long study sessions.', price: '₹12,499', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=800&q=80' },
            { name: 'Minimal Wooden Desk', description: 'Clean surface for focused work.', price: '₹9,999', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
            { name: 'Floating Wall Shelves', description: 'Vertical storage without floor clutter.', price: '₹2,199', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
            { name: 'LED Desk Lamp', description: 'Adjustable brightness for night work.', price: '₹1,899', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' }
        ],
        gaming: [
            { name: 'Gaming Chair', description: 'Reclining chair with neck support.', price: '₹18,999', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80' },
            { name: 'Wide Gaming Desk', description: 'Fits dual monitors with cable management.', price: '₹14,499', image: 'https://images.unsplash.com/photo-1593640408182-31c228961a83?auto=format&fit=crop&w=800&q=80' },
            { name: 'RGB LED Strip', description: 'Backlight glow for immersive setup.', price: '₹899', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80' },
            { name: 'Acoustic Foam Panels', description: 'Reduces echo for streaming.', price: '₹3,299', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80' }
        ],
        cozy: [
            { name: 'Comfort Armchair', description: 'Plush seating for reading corners.', price: '₹11,999', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80' },
            { name: 'Warm Floor Lamp', description: 'Soft ambient glow for evenings.', price: '₹3,499', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80' },
            { name: 'Textured Throw Blanket', description: 'Cozy knit for layered warmth.', price: '₹1,299', image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80' },
            { name: 'Soft Neutral Rug', description: 'Anchors the space with warmth.', price: '₹5,299', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' }
        ],
        kids: [
            { name: 'Kids Study Table', description: 'Height-adjustable for growing kids.', price: '₹7,499', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
            { name: 'Colorful Storage Bins', description: 'Labeled toy organizers kids love.', price: '₹1,999', image: 'https://images.unsplash.com/photo-1558618047-f4e90b9c0e3e?auto=format&fit=crop&w=800&q=80' },
            { name: 'Soft Play Rug', description: 'Cushioned and washable floor mat.', price: '₹3,799', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80' },
            { name: 'Night Light', description: 'Gentle glow for peaceful sleep.', price: '₹699', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' }
        ],
        luxury: [
            { name: 'Velvet Accent Chair', description: 'Statement seating in rich fabric.', price: '₹24,999', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80' },
            { name: 'Brass Side Table', description: 'Gold-tone finish for premium look.', price: '₹8,499', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
            { name: 'Statement Mirror', description: 'Oversized frame to open up space.', price: '₹6,999', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80' },
            { name: 'Sculptural Pendant Light', description: 'Designer ceiling focal point.', price: '₹11,299', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' }
        ],
        default: [
            { name: 'Indoor Plant', description: 'Fresh natural aesthetic for any room.', price: '₹799', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80' },
            { name: 'Warm Floor Lamp', description: 'Creates cozy ambient lighting.', price: '₹3,499', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80' },
            { name: 'Soft Neutral Rug', description: 'Adds warmth and texture.', price: '₹5,299', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
            { name: 'Minimal Wooden Desk', description: 'Clean surface for any purpose.', price: '₹9,999', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' }
        ]
    };

    // Match profile key to items
    const profileKey = profile.keys[0];
    const studyKeys = ['study', 'office', 'work', 'productive', 'desk'];
    const gamingKeys = ['gaming', 'stream', 'setup', 'pc', 'console'];
    const cozyKeys = ['cozy', 'relax', 'reading', 'guest', 'lounge'];
    const kidsKeys = ['kid', 'kids', 'nursery', 'child', 'play'];
    const luxuryKeys = ['luxury', 'premium', 'hotel', 'elegant', 'modern'];

    let itemSet;
    if (studyKeys.includes(profileKey)) itemSet = itemsByProfile.study;
    else if (gamingKeys.includes(profileKey)) itemSet = itemsByProfile.gaming;
    else if (cozyKeys.includes(profileKey)) itemSet = itemsByProfile.cozy;
    else if (kidsKeys.includes(profileKey)) itemSet = itemsByProfile.kids;
    else if (luxuryKeys.includes(profileKey)) itemSet = itemsByProfile.luxury;
    else itemSet = itemsByProfile.default;

    itemSet.forEach(item => itemsGrid.appendChild(createItemCard(item)));

    // Build design plan cards
    const cards = [
        createResultCard('fa-solid fa-bullseye', 'Room purpose', roomContext, 0),
        createResultCard('fa-solid fa-palette', 'Color palette', paletteText, 80, true),
        createResultCard('fa-solid fa-vector-square', 'Layout strategy', profile.layout, 160),
        createResultCard('fa-solid fa-couch', 'Furniture plan', profile.furniture, 240),
        createResultCard('fa-solid fa-lightbulb', 'Lighting plan', profile.lighting, 320),
        createResultCard('fa-solid fa-seedling', 'Decor details', profile.decor, 400),
        createResultCard('fa-solid fa-wallet', `${budget.value} shopping priority`, getBudgetAdvice(budget.value), 480),
        createResultCard('fa-solid fa-camera-retro', 'Prompt for image AI',
            `Redesign this ${roomType.value.toLowerCase()} as a ${profile.title.toLowerCase()} with ${profile.palette.join(', ')} colors. ${goal}`, 560)
    ];

    cards.forEach(card => results.appendChild(card));
}

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = event => {
        previewImage.src = event.target.result;
        previewImage.classList.remove('hidden');
        uploadPrompt.classList.add('hidden');
        uploadZone.classList.remove('room-preview-empty');
    };
    reader.readAsDataURL(file);
}

// Event listeners
uploadZone.addEventListener('click', () => roomPhoto.click());
uploadZone.addEventListener('dragover', event => {
    event.preventDefault();
    uploadZone.classList.add('dragover');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', event => {
    event.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFile(event.dataTransfer.files[0]);
});
roomPhoto.addEventListener('change', event => handleFile(event.target.files[0]));
designForm.addEventListener('submit', generatePlan);
sampleButton.addEventListener('click', () => {
    roomType.value = 'Bedroom';
    budget.value = 'Budget-friendly';
    roomGoal.value = 'Make this bedroom a cozy study room with calm colors, smart storage, a small reading corner, and better lighting for night work.';
    designForm.dispatchEvent(new Event('submit'));
});
