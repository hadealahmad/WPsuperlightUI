const CONFIG = {
    v2Url: 'https://hadealahmad.com/wp-json/wp/v2',
    siteName: 'هادي الأحمد',
    siteTagline: 'وحياتي غير المثيرة للاهتمام',
    perPage: 5,
    postTypes: [
        { type: 'posts', label: 'المقالات', icon: 'file-text' },
        { type: 'answers', label: 'إجابات', icon: 'message-circle' }
    ]
};

const app = document.getElementById('app');
const mainNav = document.getElementById('main-nav');
const dynamicNav = document.getElementById('dynamic-nav');
const toggleMinimalBtn = document.getElementById('toggle-minimal');
const minimalIcon = document.getElementById('minimal-icon');
const siteTitleEl = document.getElementById('site-title');
const siteTaglineEl = document.getElementById('site-tagline');
const toggleDarkBtn = document.getElementById('toggle-dark');
const darkIcon = document.getElementById('dark-icon');
const darkLabel = document.getElementById('dark-label');

const ICON_PATHS = {
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />',
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />',
    'info': '<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" />',
    'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />',
    'image-off': '<line x1="2" x2="22" y1="2" y2="22" /><path d="M10.41 10.41a2 2 0 1 1-2.82-2.82" /><line x1="21" x2="21" y1="10" y2="10" /><path d="M21 15V5a2 2 0 0 0-2-2H9" /><path d="m9 9 5 5" /><rect width="18" height="18" x="3" y="3" rx="2" />',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />',
    'tag': '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />',
    'arrow-left': '<path d="m12 19-7-7 7-7" /><path d="M19 12H5" />',
    'arrow-right': '<path d="m12 5 7 7-7 7" /><path d="M5 12h14" />',
    'file-text': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />',
    'file': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />',
    'sun': '<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />',
    'github': '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />'
};

const initIcons = () => {
    document.querySelectorAll('[data-lucide]').forEach(el => {
        const iconName = el.getAttribute('data-lucide');
        const paths = ICON_PATHS[iconName];
        if (paths) {
            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
        }
    });
};

let state = {
    minimalMode: localStorage.getItem('minimalMode') !== 'false',
    darkMode: localStorage.getItem('darkMode') === 'true',
    currentRoute: '',
    params: {},
    categoriesMap: {},
    page: 1,
    hasMore: true
};

const updateMinimalUI = () => {
    if (state.minimalMode) {
        minimalIcon.setAttribute('data-lucide', 'image-off');
        document.body.classList.add('minimal-mode');
    } else {
        minimalIcon.setAttribute('data-lucide', 'image');
        document.body.classList.remove('minimal-mode');
    }
    initIcons();
};

const updateDarkUI = () => {
    if (state.darkMode) {
        document.documentElement.classList.add('dark');
        darkIcon.setAttribute('data-lucide', 'sun');
        darkLabel.textContent = 'نهاري';
    } else {
        document.documentElement.classList.remove('dark');
        darkIcon.setAttribute('data-lucide', 'moon');
        darkLabel.textContent = 'ليلي';
    }
    initIcons();
};

toggleMinimalBtn.addEventListener('click', () => {
    state.minimalMode = !state.minimalMode;
    localStorage.setItem('minimalMode', state.minimalMode);
    updateMinimalUI();
    router();
});

toggleDarkBtn.addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    localStorage.setItem('darkMode', state.darkMode);
    updateDarkUI();
});

const parseHash = (hash) => {
    const parts = hash.replace('#', '').split('/');
    return { type: parts[0] || 'archive', id: parts[1] || null };
};

const router = async () => {
    const route = parseHash(window.location.hash);
    state.currentRoute = route.type;
    state.params = { id: route.id };
    window.scrollTo({ top: 0, behavior: 'smooth' });

    state.page = 1;
    state.hasMore = true;

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    if (route.type === 'about') {
        renderAbout();
        return;
    }

    if (route.type === 'category') {
        document.querySelector(`[href="#category/${route.id}"]`)?.classList.add('active');
        await renderArchive({ categories: route.id }, 'posts');
        return;
    }

    let postType = CONFIG.postTypes.find(pt => pt.type === route.type)?.type || 'posts';
    document.querySelector(`[href="#${postType}"]`)?.classList.add('active');

    if (route.id) {
        await renderSingle(route.id, postType);
    } else {
        await renderArchive({}, postType);
    }
};

function applySiteMeta() {
    siteTitleEl.textContent = CONFIG.siteName;
    siteTaglineEl.textContent = CONFIG.siteTagline;

    // Update SEO Meta Tags
    document.getElementById('seo-title').textContent = `${CONFIG.siteName} | ${CONFIG.siteTagline}`;
    document.getElementById('seo-description').setAttribute('content', CONFIG.siteTagline);
}

async function fetchPosts(queryOptions = {}, customPostType = 'posts') {
    try {
        const params = new URLSearchParams({ per_page: CONFIG.perPage, page: state.page, ...queryOptions });
        const response = await fetch(`${CONFIG.v2Url}/${customPostType}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;
        state.hasMore = state.page < totalPages;
        return await response.json();
    } catch (e) {
        state.hasMore = false;
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${CONFIG.v2Url}/categories?per_page=20&hide_empty=true&_fields=id,name,count`);
        if (!response.ok) return [];
        const cats = await response.json();
        cats.forEach(c => state.categoriesMap[c.id] = c.name);
        return cats;
    } catch (e) { return []; }
}

async function renderSidebars() {
    mainNav.innerHTML = CONFIG.postTypes.map(pt => `<li><a href="#${pt.type}" class="nav-item flex items-center gap-3 p-2.5 rounded-md transition-all hover:bg-accent hover:text-accent-foreground group"><i data-lucide="${pt.icon}" class="w-4 h-4 text-muted-foreground group-hover:text-primary"></i><span>${pt.label}</span></a></li>`).join('');
    const cats = await fetchCategories();
    dynamicNav.innerHTML = cats.map(cat => `<a href="#category/${cat.id}" class="nav-item flex items-center justify-between gap-3 p-2 rounded-md transition-all hover:bg-accent text-xs font-semibold group"><span>${cat.name}</span><span class="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">${cat.count}</span></a>`).join('');
    initIcons();
}

async function fetchSingle(id, postType = 'posts') {
    try {
        const response = await fetch(`${CONFIG.v2Url}/${postType}/${id}?_embed`);
        return response.ok ? await response.json() : null;
    } catch (e) { return null; }
}

async function renderArchive(options = {}, postType = 'posts', append = false) {
    if (!append) { renderLoading(); state.page = 1; }
    const posts = await fetchPosts({ ...options, _fields: 'id,date,title,excerpt,categories,jetpack_featured_media_url' }, postType);
    if (!append && posts.length === 0) {
        app.innerHTML = `<div class="py-20 text-center"><h2 class="text-2xl font-bold">لا توجد مقالات حالياً</h2></div>`;
        return;
    }
    const postsHtml = posts.map(post => {
        const featuredImage = post.jetpack_featured_media_url;
        const date = new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        const categoryName = state.categoriesMap[post.categories?.[0]] || '';
        return `<article class="post mb-20"><header class="mb-4"><div class="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-3 tracking-widest uppercase"><time>${date}</time>${categoryName ? `<span>•</span><span>${categoryName}</span>` : ''}</div><h2 class="text-3xl font-black tracking-tighter leading-tight mb-6"><a href="#${postType}/${post.id}" class="hover:underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all">${post.title.rendered}</a></h2></header><div class="content">${!state.minimalMode && featuredImage ? `<div class="mb-8 rounded-xl overflow-hidden border shadow-sm aspect-video bg-muted"><img src="${featuredImage}" class="w-full h-full object-cover" loading="lazy"></div>` : ''}<div class="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">${post.excerpt.rendered}</div><a href="#${postType}/${post.id}" class="inline-flex items-center gap-2 text-sm font-bold text-primary group underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">متابعة القراءة<i data-lucide="arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1"></i></a></div><div class="w-20 h-px bg-border my-12"></div></article>`;
    }).join('');

    if (append) {
        document.getElementById('load-more-container')?.remove();
        app.insertAdjacentHTML('beforeend', postsHtml);
    } else {
        app.innerHTML = postsHtml;
    }

    if (state.hasMore) {
        app.insertAdjacentHTML('beforeend', `<div id="load-more-container" class="py-10 flex justify-center"><button id="load-more-btn" class="px-8 py-3 rounded-full border border-border hover:bg-secondary transition-all font-bold text-sm">تحميل المزيد</button></div>`);
        document.getElementById('load-more-btn').addEventListener('click', () => { state.page++; renderArchive(options, postType, true); });
    }
    initIcons();
}

async function renderSingle(id, postType = 'posts') {
    renderLoadingSingle();
    const response = await fetch(`${CONFIG.v2Url}/${postType}/${id}?_embed&_fields=id,date,title,content,categories,jetpack_featured_media_url,_embedded`);
    const post = response.ok ? await response.json() : null;
    if (!post) {
        app.innerHTML = `<div class="py-20 text-center"><h1 class="text-2xl font-bold">المقال غير موجود</h1><a href="#" class="button mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md inline-block">العودة للرئيسية</a></div>`;
        initIcons();
        return;
    }
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || post.jetpack_featured_media_url;
    const date = new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    app.innerHTML = `<article class="max-w-none"><header class="flex flex-col gap-6 mb-12"><a href="#${postType}" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"><i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>العودة لـ ${CONFIG.postTypes.find(pt => pt.type === postType)?.label || 'الرئيسية'}</a><h1 class="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">${post.title.rendered}</h1><div class="flex items-center gap-6 text-sm font-semibold text-muted-foreground uppercase tracking-widest border-b pb-8"><div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i><span>${date}</span></div><div class="flex items-center gap-2"><i data-lucide="tag" class="w-4 h-4"></i><span>${post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام'}</span></div></div></header>${featuredImage ? `<div class="mb-12 rounded-2xl overflow-hidden border shadow-xl bg-muted aspect-video md:aspect-[21/9]"><img src="${featuredImage}" class="w-full h-full object-cover" alt="${post.title.rendered}"></div>` : ''}<div class="prose dark:prose-invert">${post.content.rendered}</div></article>`;
    initIcons();
}

function renderLoading() {
    app.innerHTML = `<div class="space-y-20">${Array(3).fill(`<div class="space-y-6"><div class="h-4 w-1/4 bg-muted rounded"></div><div class="h-12 w-full bg-muted rounded"></div><div class="h-64 w-full bg-muted rounded-xl"></div></div>`).join('')}</div>`;
}

function renderLoadingSingle() {
    app.innerHTML = `<div class="space-y-10"><div class="h-8 w-32 bg-muted rounded-md mb-6"></div><div class="h-20 w-full bg-muted rounded-md"></div><div class="w-full aspect-video bg-muted rounded-2xl mt-12"></div></div>`;
}

function renderAbout() {
    app.innerHTML = `<article><h1 class="text-5xl font-black tracking-tighter mb-10">عن الموقع</h1><div class="prose text-xl leading-relaxed space-y-8"><p>مساحة بسيطة لقراءة المحتوى المنشور على ووردبريس، بعيداً عن التعقيدات التقنية والزخارف البصرية الزائدة.</p><p>يهدف المشروع إلى توفير تجربة قراءة هادئة تركز على النص أولاً، مع استخدام تقنيات برمجية خفيفة جداً لضمان السرعة والبساطة.</p></div><a href="#" class="mt-12 inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all"><i data-lucide="arrow-right" class="w-4 h-4"></i>العودة للتصفح</a></article>`;
    initIcons();
}

window.addEventListener('hashchange', router);
updateMinimalUI();
updateDarkUI();
applySiteMeta();
renderSidebars();
router();
