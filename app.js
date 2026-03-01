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
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />',
    'info': '<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" />',
    'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />',
    'image-off': '<line x1="2" x2="22" y1="2" y2="22" /><path d="M10.41 10.41a2 2 0 1 1-2.82-2.82" /><line x1="21" x2="21" y1="10" y2="10" /><path d="M21 15V5a2 2 0 0 0-2-2H9" /><path d="m9 9 5 5" /><rect width="18" height="18" x="3" y="3" rx="2" />',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />',
    'tag': '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />',
    'arrow-left': '<path d="m12 19-7-7 7-7" /><path d="M19 12H5" />',
    'arrow-right': '<path d="m12 5 7 7-7 7" /><path d="M5 12h14" />',
    'file-text': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />',
    'list': '<line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />',
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
    $('text-icon').dataset.lucide = state.simple ? 'list' : 'file-text';
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

    document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.getAttribute('href') === location.hash));

    if (type === 'settings') return renderSettings();
    if (type === 'category') return renderArchive({ categories: id }, 'posts');

    const pt = CONFIG.postTypes.find(t => t.type === type)?.type || 'posts';
    (id && type === pt) ? await renderSingle(id, pt) : await renderArchive({}, pt);
};

const renderArchive = async (opts, pt, append = false) => {
    const feed = $('app');
    if (!append) {
        state.page = 1;
        const skeleton = state.simple
            ? '<article class="post-entry"><div class="skeleton" style="height:1rem;width:20%;margin-bottom:0.5rem;"></div><div class="skeleton" style="height:2rem;width:100%;"></div></article>'
            : '<article class="post-entry"><div class="skeleton" style="height:1rem;width:20%;margin-bottom:0.5rem;"></div><div class="skeleton" style="height:3rem;width:100%;margin-bottom:1rem;"></div><div class="skeleton" style="height:18rem;width:100%;"></div></article>';
        feed.innerHTML = `<div class="article-feed ${state.simple ? 'compact' : ''}">${skeleton.repeat(3)}</div>`;
    }
    const posts = await wp(pt, { ...opts, page: state.page, _fields: 'id,date,title,excerpt,categories,jetpack_featured_media_url' });
    if (!append && !posts?.length) return feed.innerHTML = '<div style="padding:10rem 0;text-align:center;"><h2 class="title">لا توجد مقالات</h2></div>';

    const html = posts.map(p => `
        <article class="post-entry">
            <div class="meta">
                <time>${fmtDate(p.date)}</time>
                ${state.cats[p.categories?.[0]] ? `<span>•</span><span>${state.cats[p.categories[0]]}</span>` : ''}
            </div>
            <h2 class="title">
                <a href="#${pt}/${p.id}">${p.title.rendered}</a>
            </h2>
            <div class="content">
                ${!state.minimal && p.jetpack_featured_media_url && !state.simple ? `<img src="${p.jetpack_featured_media_url}" class="w-full" style="margin-bottom: 2rem;" loading="lazy">` : ''}
                ${!state.simple && p.excerpt ? `
                    <div class="excerpt">${p.excerpt.rendered}</div>
                    <a href="#${pt}/${p.id}" class="read-more">متابعة القراءة<i data-lucide="arrow-left" style="width:1rem;height:1rem;"></i></a>
                ` : ''}
            </div>
            <div class="post-divider"></div>
        </article>`).join('');

    if (append) {
        $('loader')?.remove();
        feed.querySelector('.article-feed').insertAdjacentHTML('beforeend', html);
    } else {
        feed.innerHTML = `<div class="article-feed ${state.simple ? 'compact' : ''}">${html}</div>`;
    }

    if (state.hasMore) {
        const loader = `<div id="loader" style="padding:4rem 0;display:flex;justify-content:center;"><button id="load-more" style="padding:1rem 2.5rem;border-radius:9999px;border:1px solid hsl(var(--border));font-weight:800;font-size:0.9rem;">تحميل المزيد</button></div>`;
        feed.insertAdjacentHTML('beforeend', loader);
        $('load-more').onclick = () => { state.page++; renderArchive(opts, pt, true); };
    }
    initIcons();
};

const renderSingle = async (id, pt) => {
    $('app').innerHTML = `<div class="article-header"><div class="skeleton" style="height:2rem;width:30%;"></div><div class="skeleton" style="height:4rem;width:100%;"></div><div class="skeleton" style="height:1px;width:100%;"></div></div><div class="skeleton" style="height:25rem;width:100%;"></div>`;
    const p = await wp(`${pt}/${id}`, { _embed: 1, _fields: 'id,date,title,content,categories,jetpack_featured_media_url,_embedded' });
    if (!p) return $('app').innerHTML = '<div style="padding:10rem 0;text-align:center;"><h1 class="title">غير موجود</h1><a href="#" class="read-more">العودة</a></div>';

    const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.jetpack_featured_media_url;
    $('app').innerHTML = `
        <article class="prose">
            <header class="article-header">
                <a href="#${pt}" class="back-btn"><i data-lucide="arrow-right" style="width:1.1rem;height:1.1rem;"></i>العودة</a>
                <h1 class="main-title">${p.title.rendered}</h1>
                <div class="meta-bar">
                    <time>${fmtDate(p.date)}</time>
                    <span>•</span>
                    <span>${p._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام'}</span>
                </div>
            </header>
            ${img ? `<img src="${img}" class="w-full" style="margin-bottom:3rem;">` : ''}
            <div class="content">${p.content.rendered}</div>
        </article>`;
    initIcons();
};

function renderSettings() {
    $('app').innerHTML = `<div style="max-width:42rem;margin:0 auto;"><h1 class="title" style="font-size:3rem;margin-bottom:3rem;">إعدادات القارئ</h1><div class="flex-col gap-6">
        <div class="flex-col gap-2"><label style="font-size:0.75rem;font-weight:800;color:hsl(var(--muted-foreground));text-transform:uppercase;">رابط الـ API</label><input type="text" id="set-url" value="${CONFIG.v2Url}" style="width:100%;padding:1.25rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background-color:hsl(var(--secondary)/0.3);outline:none;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;"><input type="text" id="set-name" value="${CONFIG.siteName}" style="padding:1.25rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background-color:hsl(var(--secondary)/0.3);"><input type="text" id="set-tagline" value="${CONFIG.siteTagline}" style="padding:1.25rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background-color:hsl(var(--secondary)/0.3);"></div>
        <input type="number" id="set-perpage" value="${CONFIG.perPage}" style="width:100%;padding:1.25rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background-color:hsl(var(--secondary)/0.3);">
        <textarea id="set-posttypes" rows="5" style="width:100%;padding:1.25rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background-color:hsl(var(--secondary)/0.3);font-family:monospace;">${JSON.stringify(CONFIG.postTypes, null, 2)}</textarea>
        <button id="save-settings" style="width:100%;background-color:hsl(var(--primary));color:hsl(var(--primary-foreground));padding:1.5rem;border-radius:0.75rem;font-weight:800;font-size:1.1rem;margin-top:1rem;">حفظ</button>
    </div><p id="save-msg" style="margin-top:1.5rem;text-align:center;font-weight:800;color:#22c55e;display:none;">تم الحفظ!</p></div>`;

    $('save-settings').onclick = () => {
        const conf = { v2Url: $('set-url').value, siteName: $('set-name').value, siteTagline: $('set-tagline').value, perPage: parseInt($('set-perpage').value), postTypes: JSON.parse($('set-posttypes').value) };
        localStorage.setItem('userConfig', JSON.stringify(conf));
        $('save-msg').style.display = 'block';
        setTimeout(() => location.reload(), 1000);
    };
}

const init = async () => {
    const saved = localStorage.getItem('userConfig');
    if (saved) Object.assign(CONFIG, JSON.parse(saved));

    $('site-title').textContent = CONFIG.siteName;
    $('site-tagline').textContent = CONFIG.siteTagline;
    $('settings-btn').style.display = CONFIG.readerMode ? 'flex' : 'none';

    const seoTitle = $('seo-title'), seoDesc = $('seo-description');
    if (seoTitle) seoTitle.textContent = `${CONFIG.siteName} | ${CONFIG.siteTagline}`;
    if (seoDesc) seoDesc.content = CONFIG.siteTagline;

    $('main-nav').innerHTML = CONFIG.postTypes.map(pt => `<li><a href="#${pt.type}" class="nav-link"><i data-lucide="${pt.icon}"></i><span>${pt.label}</span></a></li>`).join('');

    $('toggle-minimal').onclick = () => { state.minimal = !state.minimal; localStorage.minimalMode = state.minimal; syncUI(); router(); };
    $('toggle-text').onclick = () => { state.simple = !state.simple; localStorage.simpleMode = state.simple; syncUI(); router(); };
    $('toggle-dark').onclick = () => { state.dark = !state.dark; localStorage.darkMode = state.dark; syncUI(); };

    syncUI();
    const cats = await wp('categories', { per_page: 20, hide_empty: true, _fields: 'id,name,count' });
    if (cats) {
        cats.forEach(c => state.cats[c.id] = c.name);
        $('dynamic-nav').innerHTML = cats.map(c => `<li><a href="#category/${c.id}" class="nav-link justify-between" style="font-size: 0.8rem;"><span style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.name}</span><span style="font-size: 10px; background-color: hsl(var(--secondary)); padding: 0.1rem 0.5rem; border-radius: 9999px; font-weight: 800;">${c.count}</span></a></li>`).join('');
    }

    window.onhashchange = router;
    await router();
};

init();
