/* ==========================================================================
   Mingxuan Liu — Academic Homepage
   Markdown-driven loader + progressive enhancement into the "linear" design system.
   Pipeline preserved: config.yml + contents/*.md via marked → inject → MathJax.
   Every transform is defensive: on failure it leaves the raw markdown intact.
   ========================================================================== */

const CONTENT_DIR = 'contents/';
const SECTIONS = ['home', 'news', 'publications', 'awards', 'talks', 'funding', 'service', 'activities', 'books', 'collaborators'];

/* Whitelisted venue acronyms → shown as pills. Order-independent set. */
const VENUES = new Set([
    'MIA', 'MICCAI', 'ISMRM', 'ISMRT', 'ISBI', 'ECCV', 'BMVC', 'ICASSP', 'ICLR', 'ICCV', 'CVPR',
    'NIMG', 'IMAG', 'PR', 'NN', 'TIM', 'BIBM', 'MIDL', 'OHBM', 'RSNA', 'PIPPI', 'BSPC', 'NEURImage',
    'NPJ DM', 'NBME', 'ISCAS', 'BioCAS', 'AI4CHL', 'WOC', 'APAO', 'BME', 'ALS', 'RAI', 'AID',
    'IF', 'JBHI', 'CJE', 'ICCBD+AI', 'NeuroImage', 'BEIHAI'
]);

window.addEventListener('DOMContentLoaded', () => {
    initChrome();

    // config.yml
    fetch(CONTENT_DIR + 'config.yml')
        .then(r => r.text())
        .then(txt => {
            const yml = jsyaml.load(txt);
            Object.keys(yml).forEach(k => {
                const el = document.getElementById(k);
                if (el) el.innerHTML = yml[k];
            });
        })
        .catch(e => console.log('config:', e));

    marked.use({ mangle: false, headerIds: false });

    const jobs = SECTIONS.map(name =>
        fetch(CONTENT_DIR + name + '.md')
            .then(r => r.text())
            .then(md => {
                const el = document.getElementById(name + '-md');
                // Publications use a custom delimited format with * / # author markers
                // that marked.js would mangle — keep the raw text and render it ourselves.
                if (name === 'publications') {
                    window.__pubsRaw = md;
                    if (el) el.innerHTML = '';
                } else if (el) {
                    el.innerHTML = marked.parse(md);
                }
            })
            .then(() => safe(() => enhance(name)))
            .catch(e => console.log(name, e))
    );

    Promise.allSettled(jobs).then(() => {
        // external links open in new tab (skip ones we already built as buttons)
        document.querySelectorAll('.main-body a[href^="http"]').forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
        safe(countStats);
        safe(initReveal);
        if (window.MathJax && MathJax.typeset) { try { MathJax.typeset(); } catch (e) { } }
    });
});

function safe(fn) { try { fn(); } catch (e) { console.log('enhance:', e); } }

function enhance(name) {
    switch (name) {
        case 'home': buildHeroLinks(); break;
        case 'publications': buildPublications(); break;
        case 'news': buildFeed('news-md', 'para', Infinity); buildFrontRail(); break;
        case 'activities': buildFeed('activities-md', 'list', Infinity); break;
        case 'awards': buildAwards(); break;
        case 'talks': buildTalks(); break;
        case 'funding': buildPlain('funding-md'); break;
        case 'service': buildService(); break;
        case 'books': buildBooks(); break;
        case 'collaborators': /* CSS grid handles it */ break;
    }
}

/* ---------------- Chrome: topbar, nav, tweaks, back-to-top ---------------- */
function initChrome() {
    const bar = document.getElementById('topbar');
    const onScroll = () => { if (bar) bar.classList.toggle('scrolled', scrollY > 6); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile nav
    const menu = document.getElementById('menu-btn');
    const nav = document.getElementById('topnav');
    if (menu && nav) {
        menu.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    }

    // scroll-spy
    const links = Array.from(document.querySelectorAll('.topnav-link'));
    const secs = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
        const spy = new IntersectionObserver(es => {
            es.forEach(e => {
                if (e.isIntersecting) {
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        secs.forEach(s => spy.observe(s));
    }

    // back to top
    const fab = document.getElementById('back-to-top');
    if (fab) {
        addEventListener('scroll', () => fab.classList.toggle('show', scrollY > 600), { passive: true });
        fab.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    }

    initTweaks();
}

function initTweaks() {
    const toggle = document.getElementById('tweaks-toggle');
    const panel = document.getElementById('tweaks-panel');
    if (toggle && panel) {
        toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; });
        document.addEventListener('click', e => {
            if (!e.target.closest('#tweaks')) panel.hidden = true;
        });
    }

    const theme = () => document.documentElement.getAttribute('data-theme') || 'light';
    const density = () => document.documentElement.getAttribute('data-density') || 'cozy';
    const accent = () => localStorage.getItem('accent') || '#D97757';
    const pagewidth = () => localStorage.getItem('pagewidth') || 'medium';
    const ground = () => localStorage.getItem('ground') || 'oat';

    // theme segment
    document.querySelectorAll('#seg-theme .seg-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.themeVal === theme());
        b.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', b.dataset.themeVal);
            try { localStorage.setItem('theme', b.dataset.themeVal); } catch (e) { }
            document.querySelectorAll('#seg-theme .seg-btn').forEach(x => x.classList.toggle('active', x === b));
        });
    });
    // width segment
    document.querySelectorAll('#seg-width .seg-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.widthVal === pagewidth());
        b.addEventListener('click', () => {
            document.documentElement.setAttribute('data-width', b.dataset.widthVal);
            try { localStorage.setItem('pagewidth', b.dataset.widthVal); } catch (e) { }
            document.querySelectorAll('#seg-width .seg-btn').forEach(x => x.classList.toggle('active', x === b));
        });
    });
    // density segment
    document.querySelectorAll('#seg-density .seg-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.densityVal === density());
        b.addEventListener('click', () => {
            document.documentElement.setAttribute('data-density', b.dataset.densityVal);
            try { localStorage.setItem('density', b.dataset.densityVal); } catch (e) { }
            document.querySelectorAll('#seg-density .seg-btn').forEach(x => x.classList.toggle('active', x === b));
        });
    });
    // ground (background) swatches
    document.querySelectorAll('#grounds .swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.ground === ground());
        s.addEventListener('click', () => {
            if (s.dataset.ground === 'ivory') {
                document.documentElement.removeAttribute('data-bg');   // ivory = the :root default
            } else {
                document.documentElement.setAttribute('data-bg', s.dataset.ground);
            }
            try { localStorage.setItem('ground', s.dataset.ground); } catch (e) { }
            document.querySelectorAll('#grounds .swatch').forEach(x => x.classList.toggle('active', x === s));
        });
    });
    // accent swatches
    document.querySelectorAll('#swatches .swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.accent.toLowerCase() === accent().toLowerCase());
        s.addEventListener('click', () => {
            document.documentElement.style.setProperty('--accent', s.dataset.accent);
            try { localStorage.setItem('accent', s.dataset.accent); } catch (e) { }
            document.querySelectorAll('#swatches .swatch').forEach(x => x.classList.toggle('active', x === s));
        });
    });
}

/* ---------------- Hero links (from home.md's "Links" line) ---------------- */
const LINK_ICONS = {
    scholar: 'M12 3L1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8-7-3.8z',
    github: 'M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z',
    cv: 'M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V8h4.5L14 3.5z',
    mail: 'M2 5h20v14H2V5zm2 2v.5l8 5 8-5V7H4zm16 3.2l-8 5-8-5V17h16v-6.8z',
    wechat: 'M8.5 4C4.9 4 2 6.5 2 9.6c0 1.8 1 3.4 2.5 4.4L4 16l2.2-1.2c.7.2 1.5.3 2.3.3h.6a5 5 0 01-.2-1.4c0-3 2.9-5.3 6.4-5.3h.6C15.5 5.9 12.3 4 8.5 4z'
};
function heroIcon(kind) {
    return `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${LINK_ICONS[kind] || ''}"/></svg>`;
}
function buildHeroLinks() {
    const root = document.getElementById('home-md');
    const box = document.getElementById('hero-links');
    if (!root || !box) return;

    // The last paragraph in home.md holds the "[Google scholar] / [Github] / [Wechat]" links.
    const ps = Array.from(root.querySelectorAll('p'));
    let linkP = null;
    for (let i = ps.length - 1; i >= 0; i--) {
        if (ps[i].querySelectorAll('a').length >= 2 && /scholar|github|wechat/i.test(ps[i].textContent)) { linkP = ps[i]; break; }
    }
    const built = [];
    // Always add CV + email as primary pills
    built.push(`<a href="https://github.com/Arktis2022/CV-Mingxuan-Liu/blob/main/CV-Mingxuan%20Liu.pdf" target="_blank" rel="noopener">${heroIcon('cv')} Curriculum Vitae</a>`);
    if (linkP) {
        linkP.querySelectorAll('a').forEach(a => {
            const t = a.textContent.toLowerCase();
            let kind = 'github';
            if (t.includes('scholar')) kind = 'scholar';
            else if (t.includes('wechat')) kind = 'wechat';
            else if (t.includes('github')) kind = 'github';
            built.push(`<a href="${a.href}" target="_blank" rel="noopener">${heroIcon(kind)} ${a.textContent}</a>`);
        });
        linkP.remove();
    }
    built.push(`<a href="mailto:arktisx@foxmail.com">${heroIcon('mail')} Email</a>`);
    box.innerHTML = built.join('');

    // Remove the redundant "CV here" paragraph + contact/edu/interests headings from lede,
    // keeping only the opening research statement for a clean hero.
    trimHeroLede(root);
}

function trimHeroLede(root) {
    // Keep only content before the first <h4> (Contact); the rest is surfaced elsewhere/in CV.
    const kids = Array.from(root.childNodes);
    let cut = false;
    kids.forEach(n => {
        if (n.nodeType === 1 && n.tagName === 'H4') cut = true;
        if (cut) n.remove();
        // also drop the "You can find my CV here" paragraph
        if (!cut && n.nodeType === 1 && n.tagName === 'P' && /find my CV here/i.test(n.textContent)) n.remove();
    });
}

/* ---------------- Publications ----------------
   Rendered from a custom delimited markdown format (window.__pubsRaw):
     #### SECTION NAME  <!--SHOW|HIDDEN-->
     - TITLE ||| AUTHORS ||| VENUE ||| YEAR ||| HONORS ||| LINKS ||| BIBKEY
   Each field may be empty. LINKS is markdown "[Label](url) ...". BIBKEY refers
   to a <div id="bib_..."> kept (hidden) at the end of the same file, verbatim.
   ------------------------------------------------------------------------- */

function buildPublications() {
    const root = document.getElementById('publications-md');
    const raw = window.__pubsRaw;
    if (!root || !raw) return;

    // 1. Extract the hidden bibtex store, map id → text.
    const bibMap = {};
    const store = raw.match(/<div style="display:none" id="bib-store">([\s\S]*?)<\/div>\s*$/);
    if (store) {
        const re = /<div id="(bib_[^"]+)"[^>]*>([\s\S]*?)<\/div>/g;
        let m;
        while ((m = re.exec(store[1]))) bibMap[m[1]] = m[2].trim();
    }
    const body = store ? raw.slice(0, store.index) : raw;

    // 2. Walk lines into sections + entries.
    const groups = [];
    body.split('\n').forEach(line => {
        const hm = line.match(/^####\s*(.+?)\s*(?:<!--(SHOW|HIDDEN)-->)?\s*$/);
        if (hm) {
            groups.push({ title: hm[1].trim(), hidden: hm[2] === 'HIDDEN', cat: catOf(hm[1]), items: [] });
            return;
        }
        if (line.startsWith('- ') && groups.length) {
            groups[groups.length - 1].items.push(line.slice(2));
        }
    });
    if (!groups.length) return;

    // 3. Render.
    const out = document.createElement('div');
    out.className = 'pubs-inner';
    groups.forEach(g => {
        if (g.hidden || !g.items.length) return;   // skip the hidden "Under Review" store
        const h = document.createElement('div');
        h.className = 'pub-group-title';
        h.textContent = g.title;
        h.dataset.cat = g.cat;
        out.appendChild(h);
        g.rows = g.items.map((entry, i) => {
            const r = pubRow(entry, g.cat, bibMap);
            r.dataset.idx = i;
            out.appendChild(r);
            return r;
        });
    });

    root.innerHTML = '';
    root.appendChild(out);
    buildFilters(groups.filter(g => !g.hidden && g.items.length));
    applyPubView('all');
}

const PUB_LIMIT = Infinity;   // show the complete record — no "selected" cap
let pubExpanded = {};

/* Central visibility controller for publications. */
function applyPubView(filter) {
    const rows = Array.from(document.querySelectorAll('.pub-row'));
    const titles = Array.from(document.querySelectorAll('.pub-group-title'));

    rows.forEach(r => {
        const cat = r.dataset.cat;
        let show;
        if (filter === 'all') show = true;
        else if (filter === 'first') show = r.dataset.first === '1';
        else show = cat === filter;
        r.classList.toggle('hidden', !show);
    });

    // hide group titles with no visible rows
    titles.forEach(t => {
        const cat = t.dataset.cat;
        const any = rows.some(r => r.dataset.cat === cat && !r.classList.contains('hidden'));
        t.style.display = any ? '' : 'none';
    });
}

function catOf(text) {
    const t = text.toUpperCase();
    if (t.includes('JOURNAL')) return 'journal';
    if (t.includes('CONFERENCE PAPER') || t.includes('PROCEEDING')) return 'conference';
    if (t.includes('ABSTRACT')) return 'abstract';
    if (t.includes('REVIEW') || t.includes('MANUSCRIPT')) return 'review';
    return 'other';
}

/* escape user text for safe HTML injection */
function esc(s) {
    return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/* Render authors: escape, bold+underline "M. Liu"/"Mingxuan Liu" (with optional #). */
function renderAuthors(s) {
    let h = esc(s);
    h = h.replace(/(Mingxuan\s+Liu|M\.\s*Liu)(#?)/g,
        (m) => `<span class="author-me">${m}</span>`);
    return h;
}

/* Parse a "[Label](url) [Label](url)" string into button/link HTML. */
function renderLinks(s) {
    const links = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)/g;
    let m;
    while ((m = re.exec(s))) links.push({ label: m[1].trim(), href: m[2].trim() });
    return links;
}

function pubRow(entry, cat, bibMap) {
    const parts = entry.split('|||').map(s => s.trim());
    const [title, authors, venue, year, honors, linksStr, bibKey] = [
        parts[0] || '', parts[1] || '', parts[2] || '', parts[3] || '',
        parts[4] || '', parts[5] || '', parts[6] || ''
    ];

    const row = document.createElement('div');
    row.className = 'pub-row';
    row.dataset.cat = cat;
    row.dataset.year = year;

    // first / co-first authorship: leads the list, or name followed by '#'
    const isLead = /^\s*(M\.\s*Liu|Mingxuan\s+Liu)/.test(authors);
    const isCoFirst = /(M\.\s*Liu|Mingxuan\s+Liu)\s*#/.test(authors);
    row.dataset.first = (isLead || isCoFirst) ? '1' : '0';

    // meta column (year)
    const meta = document.createElement('div');
    meta.className = 'pub-meta';
    meta.innerHTML = year ? `<span class="pub-year">${esc(year)}</span>` : '&mdash;';

    // body column
    const body = document.createElement('div');
    body.className = 'pub-body';

    // line 1: title
    if (title) {
        const t = document.createElement('div');
        t.className = 'pub-title-line';
        t.innerHTML = esc(title);
        body.appendChild(t);
    }
    // line 2: authors
    if (authors) {
        const a = document.createElement('div');
        a.className = 'pub-authors';
        a.innerHTML = renderAuthors(authors);
        body.appendChild(a);
    }
    // line 3: venue, year, honor + links
    const venueLine = document.createElement('div');
    venueLine.className = 'pub-venue-line';
    let vhtml = '';
    if (venue) vhtml += `<span class="pub-venue">${esc(venue)}</span>`;
    if (year) vhtml += `<span class="pub-vyear">, ${esc(year)}</span>`;
    if (honors) vhtml += `<span class="pill-honor"> ${esc(honors)}</span>`;
    venueLine.innerHTML = vhtml;

    // links + bibtex
    const links = renderLinks(linksStr);
    if (links.length || bibKey) {
        const lc = document.createElement('span');
        lc.className = 'pub-links';
        links.forEach(l => {
            lc.innerHTML += `<a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`;
        });
        if (bibKey && bibMap[bibKey]) {
            const id = 'bibx_' + Math.abs(hashStr(bibKey)).toString(36);
            lc.innerHTML += `<button class="lnk lnk-bib" data-target="${id}">BibTeX</button>`;
            venueLine.appendChild(lc);
            const box = document.createElement('pre');
            box.className = 'bib-box';
            box.id = id;
            box.hidden = true;
            box.textContent = bibMap[bibKey];
            body.appendChild(venueLine);
            body.appendChild(box);
        } else {
            venueLine.appendChild(lc);
            body.appendChild(venueLine);
        }
    } else {
        body.appendChild(venueLine);
    }

    row.appendChild(meta);
    row.appendChild(body);

    // wire bibtex toggle
    row.querySelectorAll('.lnk-bib').forEach(btn => {
        btn.addEventListener('click', () => {
            const box = document.getElementById(btn.dataset.target);
            if (box) { box.hidden = !box.hidden; btn.classList.toggle('is-open', !box.hidden); }
        });
    });

    return row;
}

function cap(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

function buildFilters(groups) {
    const box = document.getElementById('pub-filters');
    if (!box) return;
    const cats = [
        { key: 'all', label: 'All' },
        { key: 'journal', label: 'Journal' },
        { key: 'conference', label: 'Conference' },
        { key: 'abstract', label: 'Abstracts' }
    ];
    const rows = () => Array.from(document.querySelectorAll('.pub-row'));
    const titles = () => Array.from(document.querySelectorAll('.pub-group-title'));
    box.innerHTML = cats.map(c => {
        const n = c.key === 'all' ? rows().length : rows().filter(r => r.dataset.cat === c.key).length;
        if (n === 0 && c.key !== 'all') return '';
        return `<button class="filter-chip${c.key === 'all' ? ' active' : ''}" data-f="${c.key}">${c.label}<span class="cnt">${n}</span></button>`;
    }).join('') +
        `<button class="filter-chip" data-f="first">First-author<span class="cnt">${rows().filter(r => r.dataset.first === '1').length}</span></button>`;

    box.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            box.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
            applyPubView(chip.dataset.f);
        });
    });
}

/* ---------------- Feed (news / activities) ---------------- */
function buildFeed(id, mode, initial) {
    const root = document.getElementById(id);
    if (!root) return;
    const scope = root.querySelector('div') || root;
    const items = [];

    if (mode === 'para') {
        scope.querySelectorAll(':scope > p').forEach(p => {
            const strong = p.querySelector('strong');
            if (!strong || !/\d{4}\.\d{2}/.test(strong.textContent)) return;
            const date = strong.textContent.replace(/:\s*$/, '').trim();
            strong.remove();
            items.push(feedItem(date, p.innerHTML.replace(/^\s*[:：]?\s*/, ''), p.textContent));
        });
    } else {
        scope.querySelectorAll(':scope > ul > li, :scope > li').forEach(li => {
            const em = li.querySelector('em');
            const date = em ? em.textContent.trim() : '';
            if (em) em.remove();
            items.push(feedItem(date, li.innerHTML.replace(/^\s*,?\s*/, ''), li.textContent));
        });
    }
    if (!items.length) return;

    const box = document.createElement('div');
    box.className = 'feed-inner';
    items.forEach((it, i) => { if (i >= initial) it.classList.add('feed-hidden'), it.style.display = 'none'; box.appendChild(it); });

    root.innerHTML = '';
    root.appendChild(box);

    if (items.length > initial) {
        const more = document.createElement('div');
        more.className = 'feed-more';
        const btn = document.createElement('button');
        const rest = items.length - initial;
        btn.textContent = `Show ${rest} more`;
        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            box.querySelectorAll('.feed-hidden').forEach(el => el.style.display = expanded ? '' : 'none');
            btn.textContent = expanded ? 'Show less' : `Show ${rest} more`;
        });
        more.appendChild(btn);
        root.appendChild(more);
    }
}

function feedItem(date, html, raw) {
    const el = document.createElement('div');
    el.className = 'feed-item';
    if (/★|🎉|🎈|🏆|Award|Winner|Prize|accepted|Accept/i.test(raw)) el.classList.add('starred');
    el.innerHTML = `<div class="feed-date">${date}</div><div class="feed-body">${html}</div>`;
    return el;
}

/* Front-page "Latest" rail — mirror the newest few news items into the hero side rail. */
function buildFrontRail(limit = 5) {
    const src = document.querySelectorAll('#news-md .feed-item');
    const rail = document.getElementById('front-rail');
    const body = document.getElementById('front-rail-body');
    if (!src.length || !rail || !body) return;
    const n = Math.min(limit, src.length);
    let html = '';
    for (let i = 0; i < n; i++) {
        const date = src[i].querySelector('.feed-date');
        const text = src[i].querySelector('.feed-body');
        if (!text) continue;
        const d = date ? date.textContent.trim() : '';
        html += `<div class="fr-item"><span class="fr-date">${d}</span>${text.innerHTML}</div>`;
    }
    body.innerHTML = html;
    rail.hidden = false;
}

/* ---------------- Awards ---------------- */
function buildAwards() {
    const root = document.getElementById('awards-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'award-row';

        // cert link
        let cert = '';
        const a = li.querySelector('a');
        if (a && /certificate/i.test(a.textContent)) { cert = a.href; a.remove(); }

        // year (italic *2026* → <em>)
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();

        // clean leading separators
        let html = li.innerHTML.replace(/^[\s,\-–—:]+/, '').replace(/<br\s*\/?>\s*/i, '§SUB§');
        const parts = html.split('§SUB§');
        const title = parts[0].trim();
        const sub = parts[1] ? parts[1].trim() : '';

        row.innerHTML =
            `<div class="award-year">${year}</div>` +
            `<div class="award-title">${title}${sub ? `<span class="award-sub">${sub}</span>` : ''}</div>` +
            (cert ? `<a class="award-cert" href="${cert}" target="_blank" rel="noopener">Certificate</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Talks ---------------- */
function buildTalks() {
    const root = document.getElementById('talks-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'talk-row';
        let slides = '';
        const a = li.querySelector('a');
        if (a && /slides/i.test(a.textContent)) { slides = a.href; a.remove(); }
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();
        const ttl = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML =
            `<div class="yr">${year}</div><div class="ttl">${ttl}</div>` +
            (slides ? `<a class="slides" href="${slides}" target="_blank" rel="noopener">Slides</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Plain year/title list (funding) ---------------- */
function buildPlain(id) {
    const root = document.getElementById(id);
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'plain-row';
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();
        const ttl = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML = `<div class="yr">${year}</div><div class="ttl">${ttl}</div><span></span>`;
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Service (bold heading + list → cards) ---------------- */
function buildService() {
    const root = document.getElementById('service-md');
    if (!root) return;
    const cards = [];
    let cur = null;
    Array.from(root.childNodes).forEach(n => {
        if (n.nodeType !== 1) return;
        // Heading paragraphs are <p><strong>…</strong></p>
        const isHead = n.tagName === 'P' && n.children.length === 1 && n.querySelector('strong');
        if (isHead) {
            cur = { title: n.querySelector('strong').textContent.trim(), html: '' };
            cards.push(cur);
        } else if (n.tagName === 'UL' && cur) {
            cur.html += n.outerHTML;
        }
    });
    if (!cards.length) return;
    root.innerHTML = cards.map(c =>
        `<div class="svc-card"><h5>${c.title}</h5>${c.html}</div>`
    ).join('');
}

/* ---------------- Books ---------------- */
function buildBooks() {
    const root = document.getElementById('books-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'book-row';
        const em = li.querySelector('em');
        const span = em ? em.textContent.trim() : '';
        if (em) em.remove();
        // last link is often the "Book" photo
        let ext = '';
        const links = li.querySelectorAll('a');
        if (links.length) {
            const lastA = links[links.length - 1];
            if (/^book$/i.test(lastA.textContent.trim())) { ext = lastA.href; lastA.remove(); }
        }
        const bk = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML =
            `<div class="span">${span}</div><div class="bk">${bk}</div>` +
            (ext ? `<a href="${ext}" target="_blank" rel="noopener">cover</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Stats ---------------- */
function countStats() {
    const rows = Array.from(document.querySelectorAll('.pub-row'))
        .filter(r => r.dataset.cat !== 'review');
    const pubs = rows.length;
    const first = rows.filter(r => r.dataset.first === '1').length;
    const awards = document.querySelectorAll('#awards-md .award-row').length;
    const talks = document.querySelectorAll('#talks-md .talk-row').length;
    animateNum('stat-pubs', pubs, true);
    animateNum('stat-first', first, true);
    animateNum('stat-awards', awards, true);
    animateNum('stat-talks', talks, false);
}

function animateNum(id, target, plus) {
    const el = document.getElementById(id);
    if (!el) return;
    const suffix = plus && target > 0 ? '<span class="plus">+</span>' : '';
    if (!target) { el.textContent = '0'; return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.innerHTML = target + suffix; return; }
    const run = () => {
        const dur = 1200, t0 = performance.now();
        const tick = now => {
            const p = Math.min(1, (now - t0) / dur);
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
            el.innerHTML = v + (p >= 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { run(); o.disconnect(); } }), { threshold: .4 });
        io.observe(el);
    } else run();
}

/* ---------------- Reveal ---------------- */
function initReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es, o) => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
    }), { threshold: .06, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section, .metrics').forEach(el => { el.classList.add('reveal'); io.observe(el); });
}
