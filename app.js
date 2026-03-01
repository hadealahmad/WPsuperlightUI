const CONFIG = {
    v2Url: 'https://hadealahmad.com/wp-json/wp/v2',
    siteName: 'هادي الأحمد',
    siteTagline: 'وحياتي غير المثيرة للاهتمام',
    perPage: 5,
    postTypes: [
        { type: 'posts', label: 'المقالات', icon: 'file-text' },
        { type: 'answers', label: 'إجابات', icon: 'message-circle' }
    ],
    readerMode: true
};

const $ = id => document.getElementById(id);
const state = {
    minimal: localStorage.getItem('minimalMode') !== 'false',
    dark: localStorage.getItem('darkMode') === 'true',
    simple: localStorage.getItem('simpleMode') !== 'false',
    page: 1, hasMore: true, cats: {}
};

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
    'github': '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />',
    'settings': '<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1V15a2 2 0 0 1-2-2 2 2 0 0 1 2-2v-.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2v.09a1.65 1.65 0 0 0-1.51 1z" />'
};

const initIcons = () => document.querySelectorAll('[data-lucide]').forEach(el => {
    const p = ICON_PATHS[el.dataset.lucide];
    if (p) el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
});

const syncUI = () => {
    document.body.classList.toggle('minimal-mode', state.minimal);
    document.documentElement.classList.toggle('dark', state.dark);
    $('minimal-icon').dataset.lucide = state.minimal ? 'image-off' : 'image';
    $('dark-icon').dataset.lucide = state.dark ? 'sun' : 'moon';
    $('dark-label').textContent = state.dark ? 'نهاري' : 'ليلي';
    $('text-label').textContent = state.simple ? 'بسيط' : 'كامل';
    initIcons();
};

const wp = async (path, params = {}) => {
    try {
        const fields = params._fields ? params._fields.split(',') : [];
        if (state.simple && fields.includes('excerpt')) {
            params._fields = fields.filter(f => f !== 'excerpt').join(',');
        }
        const r = await fetch(`${CONFIG.v2Url}/${path}?` + new URLSearchParams({ per_page: CONFIG.perPage, ...params }));
        if (!r.ok) return null;
        const total = r.headers.get('X-WP-TotalPages');
        if (total && params.page) state.hasMore = params.page < parseInt(total);
        return r.json();
    } catch { return null; }
};

const fmtDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

const router = async () => {
    const [type = 'posts', id] = location.hash.replace('#', '').split('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Object.assign(state, { page: 1, hasMore: true });

    document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.getAttribute('href') === location.hash));

    if (type === 'settings') return renderSettings();
    if (type === 'about') return renderAbout();
    if (type === 'category') return renderArchive({ categories: id }, 'posts');

    const pt = CONFIG.postTypes.find(t => t.type === type)?.type || 'posts';
    (id && type === pt) ? await renderSingle(id, pt) : await renderArchive({}, pt);
};

const renderArchive = async (opts, pt, append = false) => {
    if (!append) {
        state.page = 1;
        const skeleton = state.simple
            ? '<div class="space-y-4"><div class="h-4 w-1/4 bg-muted rounded"></div><div class="h-8 w-full bg-muted rounded"></div></div>'
            : '<div class="space-y-6"><div class="h-4 w-1/4 bg-muted rounded"></div><div class="h-12 w-full bg-muted rounded"></div><div class="h-64 w-full bg-muted rounded-xl"></div></div>';
        $('app').innerHTML = `<div class="${state.simple ? 'space-y-12' : 'space-y-20'}">${Array(3).fill(skeleton).join('')}</div>`;
    }
    const posts = await wp(pt, { ...opts, page: state.page, _fields: 'id,date,title,excerpt,categories,jetpack_featured_media_url' });
    if (!append && !posts?.length) return $('app').innerHTML = '<div class="py-20 text-center"><h2 class="text-2xl font-bold">لا توجد مقالات</h2></div>';

    const html = posts.map(p => `
        <article class="post ${state.simple ? 'mb-8' : 'mb-20'}">
            <header class="${state.simple ? 'mb-2' : 'mb-4'}">
                <div class="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-3 tracking-widest uppercase">
                    <time>${fmtDate(p.date)}</time>
                    ${state.cats[p.categories?.[0]] ? `<span>•</span><span>${state.cats[p.categories[0]]}</span>` : ''}
                </div>
                <h2 class="${state.simple ? 'text-xl' : 'text-3xl'} font-black tracking-tighter leading-tight ${state.simple ? 'mb-2' : 'mb-6'}">
                    <a href="#${pt}/${p.id}" class="hover:underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all">${p.title.rendered}</a>
                </h2>
            </header>
            <div class="content">
                ${!state.minimal && p.jetpack_featured_media_url && !state.simple ? `<div class="mb-8 rounded-xl overflow-hidden border shadow-sm aspect-video bg-muted"><img src="${p.jetpack_featured_media_url}" class="w-full h-full object-cover" loading="lazy"></div>` : ''}
                ${!state.simple && p.excerpt ? `
                    <div class="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">${p.excerpt.rendered}</div>
                    <a href="#${pt}/${p.id}" class="inline-flex items-center gap-2 text-sm font-bold text-primary group underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">متابعة القراءة<i data-lucide="arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1"></i></a>
                ` : ''}
            </div>
            <div class="w-20 h-px bg-border ${state.simple ? 'my-8' : 'my-12'}"></div>
        </article>`).join('');

    if (append) {
        $('load-more-container')?.remove();
        $('app').insertAdjacentHTML('beforeend', html);
    } else {
        $('app').innerHTML = html;
    }

    if (state.hasMore) {
        $('app').insertAdjacentHTML('beforeend', '<div id="load-more-container" class="py-10 flex justify-center"><button id="load-more-btn" class="px-8 py-3 rounded-full border border-border hover:bg-secondary transition-all font-bold text-sm">تحميل المزيد</button></div>');
        $('load-more-btn').onclick = () => { state.page++; renderArchive(opts, pt, true); };
    }
    initIcons();
};

const renderSingle = async (id, pt) => {
    $('app').innerHTML = `<div class="space-y-10"><div class="h-8 w-32 bg-muted rounded-md mb-6"></div><div class="h-20 w-full bg-muted rounded-md"></div><div class="w-full aspect-video bg-muted rounded-2xl mt-12"></div></div>`;
    const p = await wp(`${pt}/${id}`, { _embed: 1, _fields: 'id,date,title,content,categories,jetpack_featured_media_url,_embedded' });
    if (!p) return $('app').innerHTML = '<div class="py-20 text-center"><h1 class="text-2xl font-bold">غير موجود</h1><a href="#" class="button mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md inline-block">العودة</a></div>';

    const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.jetpack_featured_media_url;
    $('app').innerHTML = `
        <article class="max-w-none">
            <header class="flex flex-col gap-6 mb-12">
                <a href="#${pt}" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground group"><i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>العودة</a>
                <h1 class="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">${p.title.rendered}</h1>
                <div class="flex items-center gap-6 text-sm font-semibold text-muted-foreground uppercase tracking-widest border-b pb-8">
                    <span class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i>${fmtDate(p.date)}</span>
                    <span class="flex items-center gap-2"><i data-lucide="tag" class="w-4 h-4"></i>${p._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام'}</span>
                </div>
            </header>
            ${img ? `<div class="mb-12 rounded-2xl overflow-hidden border shadow-xl bg-muted aspect-video md:aspect-[21/9]"><img src="${img}" class="w-full h-full object-cover"></div>` : ''}
            <div class="prose dark:prose-invert">${p.content.rendered}</div>
        </article>`;
    initIcons();
};

function renderAbout() {
    $('app').innerHTML = `<article><h1 class="text-5xl font-black tracking-tighter mb-10">عن الموقع</h1><div class="prose text-xl leading-relaxed space-y-8"><p>مساحة بسيطة لقراءة المحتوى المنشور على ووردبريس، بعيداً عن التعقيدات التقنية.</p></div><a href="#" class="mt-12 inline-flex items-center gap-2 font-bold underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all"><i data-lucide="arrow-right" class="w-4 h-4"></i>العودة</a></article>`;
    initIcons();
}

function renderSettings() {
    $('app').innerHTML = `<article class="max-w-2xl mx-auto"><h1 class="text-5xl font-black tracking-tighter mb-10">إعدادات القارئ</h1><div class="space-y-8">
        <div class="space-y-3"><label class="text-sm font-bold text-muted-foreground uppercase tracking-widest">رابط الـ API</label><input type="text" id="set-url" value="${CONFIG.v2Url}" class="w-full p-4 rounded-xl border bg-secondary/30 outline-none"></div>
        <div class="grid md:grid-cols-2 gap-6"><input type="text" id="set-name" value="${CONFIG.siteName}" class="p-4 rounded-xl border bg-secondary/30"><input type="text" id="set-tagline" value="${CONFIG.siteTagline}" class="p-4 rounded-xl border bg-secondary/30"></div>
        <input type="number" id="set-perpage" value="${CONFIG.perPage}" class="w-full p-4 rounded-xl border bg-secondary/30">
        <textarea id="set-posttypes" rows="5" class="w-full p-4 rounded-xl border bg-secondary/30 font-mono">${JSON.stringify(CONFIG.postTypes, null, 2)}</textarea>
        <button id="save-settings" class="w-full bg-primary text-primary-foreground p-5 rounded-xl font-bold text-lg hover:shadow-lg transition-all">حفظ</button>
    </div><p id="save-msg" class="mt-4 text-center text-sm font-bold text-green-500 hidden">تم الحفظ!</p></article>`;

    $('save-settings').onclick = () => {
        const conf = { v2Url: $('set-url').value, siteName: $('set-name').value, siteTagline: $('set-tagline').value, perPage: parseInt($('set-perpage').value), postTypes: JSON.parse($('set-posttypes').value) };
        localStorage.setItem('userConfig', JSON.stringify(conf));
        $('save-msg').classList.remove('hidden');
        setTimeout(() => location.reload(), 1000);
    };
}

const init = async () => {
    const saved = localStorage.getItem('userConfig');
    if (saved) Object.assign(CONFIG, JSON.parse(saved));

    $('site-title').textContent = CONFIG.siteName;
    $('site-tagline').textContent = CONFIG.siteTagline;
    $('settings-btn')?.classList.toggle('hidden', !CONFIG.readerMode);

    const seoTitle = $('seo-title'), seoDesc = $('seo-description');
    if (seoTitle) seoTitle.textContent = `${CONFIG.siteName} | ${CONFIG.siteTagline}`;
    if (seoDesc) seoDesc.content = CONFIG.siteTagline;

    $('main-nav').innerHTML = CONFIG.postTypes.map(pt => `<li><a href="#${pt.type}" class="nav-item flex items-center gap-3 p-2.5 rounded-md transition-all hover:bg-accent group"><i data-lucide="${pt.icon}" class="w-4 h-4 text-muted-foreground group-hover:text-primary"></i><span>${pt.label}</span></a></li>`).join('');

    $('toggle-minimal').onclick = () => { state.minimal = !state.minimal; localStorage.minimalMode = state.minimal; syncUI(); router(); };
    $('toggle-text').onclick = () => { state.simple = !state.simple; localStorage.simpleMode = state.simple; syncUI(); router(); };
    $('toggle-dark').onclick = () => { state.dark = !state.dark; localStorage.darkMode = state.dark; syncUI(); };

    const cats = await wp('categories', { per_page: 20, hide_empty: true, _fields: 'id,name,count' });
    if (cats) {
        cats.forEach(c => state.cats[c.id] = c.name);
        $('dynamic-nav').innerHTML = cats.map(c => `<li><a href="#category/${c.id}" class="nav-item flex items-center justify-between gap-3 p-2 rounded-md transition-all hover:bg-accent text-xs font-semibold group"><span>${c.name}</span><span class="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">${c.count}</span></a></li>`).join('');
    }

    syncUI();
    window.onhashchange = router;
    await router();
};

init();
