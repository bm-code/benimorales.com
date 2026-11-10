const CONTENT = window.PORTFOLIO_CONTENT || {};
const PROJECTS = window.PORTFOLIO_PROJECTS || [];
const LANGS = ['es', 'en'];
const GTM_ID = 'GTM-NKQC82H';

const TECH_ICONS = {
    HTML: './img/html.svg',
    CSS: './img/css.svg',
    JavaScript: './img/javascript.svg',
    React: './img/react.svg',
    Angular: './img/angular.svg',
    Bootstrap: './img/bootstrap.svg',
    Vite: './img/vite.svg',
    NPM: './img/npm.svg',
    jQuery: './img/jquery.svg',
    Git: './img/git.svg',
    Illustrator: './img/illustrator.svg',
    'Adobe XD': './img/adobe-xd.svg'
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lang = 'es';

const $ = (selector, root = document) => root.querySelector(selector);
const pick = (pair) => (pair && (pair[lang] || pair.es)) || '';
const ui = (key) => CONTENT.ui?.[lang]?.[key] ?? CONTENT.ui?.es?.[key] ?? '';

function detectLang() {
    try {
        const stored = localStorage.getItem('lang');
        if (LANGS.includes(stored)) {
            return stored;
        }
    } catch (error) {
        // localStorage no disponible: se usa el idioma del navegador.
    }

    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

function el(tag, className, text) {
    const node = document.createElement(tag);

    if (className) {
        node.className = className;
    }

    if (text !== undefined) {
        node.textContent = text;
    }

    return node;
}

function createTechPills(tech = []) {
    const fragment = document.createDocumentFragment();

    tech.forEach((name) => {
        const item = el('li');
        const iconPath = TECH_ICONS[name];

        if (iconPath) {
            const icon = el('img');
            icon.src = iconPath;
            icon.alt = '';
            icon.width = 14;
            icon.height = 14;
            icon.loading = 'lazy';
            item.appendChild(icon);
        }

        item.appendChild(el('span', '', name));
        fragment.appendChild(item);
    });

    return fragment;
}

function renderStatic() {
    document.documentElement.lang = lang;
    document.title = ui('pageTitle');
    $('meta[name="description"]')?.setAttribute('content', ui('pageDescription'));
    $('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_US' : 'es_ES');

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        node.textContent = ui(node.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((node) => {
        node.dataset.i18nAttr.split(',').forEach((entry) => {
            const [attr, key] = entry.split(':');
            node.setAttribute(attr, ui(key));
        });
    });

    const toggle = $('#lang-toggle');
    toggle.setAttribute('aria-label', ui('langSwitchLabel'));
    toggle.setAttribute('lang', lang === 'es' ? 'en' : 'es');
    $('span', toggle).textContent = ui('langSwitchText');

    syncMenuLabel();
}

function renderHero() {
    const hero = CONTENT.hero || {};

    $('#hero-role').textContent = pick(hero.role);
    $('#hero-intro').textContent = pick(hero.intro);
    $('#hero-line').textContent = pick(hero.line);

    const track = $('#marquee-track');
    track.replaceChildren();

    // La lista se duplica para que el bucle de la animacion sea continuo.
    [...(hero.marquee || []), ...(hero.marquee || [])].forEach((text) => {
        track.appendChild(el('span', 'marquee__item', text));
    });
}

function renderProfile() {
    $('#profile-summary').textContent = pick(CONTENT.profileSummary);

    const stackGroups = $('#stack-groups');
    stackGroups.replaceChildren();

    (CONTENT.stackGroups || []).forEach((group) => {
        const card = el('article', 'stack-card');
        const list = el('ul', 'chip-list');

        group.items.forEach((item) => list.appendChild(el('li', '', item)));
        card.append(el('h4', 'stack-card__title', pick(group.title)), list);
        stackGroups.appendChild(card);
    });

    const whyList = $('#why-list');
    whyList.replaceChildren();

    (CONTENT.whyMe || []).forEach((item) => whyList.appendChild(el('li', '', pick(item))));
}

function renderExperience() {
    const experienceList = $('#experience-list');
    const educationList = $('#education-list');

    experienceList.replaceChildren();
    educationList.replaceChildren();

    (CONTENT.experience || []).forEach((job) => {
        const item = el('li', 'timeline__item');
        const heading = el('div', 'timeline__heading');
        const bullets = el('ul', 'timeline__bullets');

        heading.append(el('h3', 'timeline__company', job.company), el('p', 'timeline__period', pick(job.period)));
        job.bullets.forEach((bullet) => bullets.appendChild(el('li', '', pick(bullet))));

        item.append(heading, el('p', 'timeline__role', pick(job.role)), bullets);
        experienceList.appendChild(item);
    });

    (CONTENT.education || []).forEach((entry) => {
        const item = el('li', 'education__item');
        item.append(el('p', 'education__title', pick(entry.title)), el('p', 'education__school', entry.school));
        educationList.appendChild(item);
    });
}

function renderProject(project, templateId) {
    const template = document.getElementById(templateId);
    const clone = template.content.cloneNode(true);
    const image = $('.card__image', clone);
    const link = $('.card__link', clone);

    image.src = project.image;
    image.alt = ui('previewAlt').replace('{title}', project.title);
    image.width = project.width;
    image.height = project.height;

    $('.card__year', clone).textContent = project.year;
    $('.card__title', clone).textContent = project.title;
    $('.card__summary', clone).textContent = pick(project.summary);
    $('.tech-pills', clone).appendChild(createTechPills(project.tech));

    link.href = project.url;
    link.setAttribute('aria-label', ui('viewProjectLabel').replace('{title}', project.title));
    $('span', link).textContent = ui('viewProject');

    return clone;
}

function renderProjects() {
    const featured = $('#featured-projects');
    const archive = $('#archive-projects');

    featured.replaceChildren();
    archive.replaceChildren();

    PROJECTS.filter((project) => project.tier === 'featured').forEach((project) => {
        featured.appendChild(renderProject(project, 'featured-card-template'));
    });

    PROJECTS.filter((project) => project.tier === 'archive').forEach((project) => {
        archive.appendChild(renderProject(project, 'archive-card-template'));
    });
}

function renderContact() {
    const container = $('#contact-grid');
    const contact = CONTENT.contact || {};

    container.replaceChildren();

    const cards = [
        { label: 'Email', value: contact.email, icon: './img/mensaje.svg', href: `mailto:${contact.email}` },
        { label: 'LinkedIn', value: 'linkedin.com/in/benimoralessilva', icon: './img/linkedin.svg', href: contact.linkedin },
        { label: 'GitHub', value: 'github.com/bm-code', icon: './img/github.svg', href: contact.github },
        { label: ui('location'), value: contact.location, icon: './img/location.svg' }
    ];

    cards.forEach((item) => {
        const card = el(item.href ? 'a' : 'div', 'contact-card');

        if (item.href) {
            card.href = item.href;

            if (!item.href.startsWith('mailto:')) {
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
            }
        }

        const icon = el('img');
        icon.src = item.icon;
        icon.alt = '';
        icon.width = 24;
        icon.height = 24;

        const text = el('div');
        text.append(el('p', 'contact-card__label', item.label), el('p', 'contact-card__value', item.value));

        card.append(icon, text);
        container.appendChild(card);
    });
}

function renderAll() {
    renderStatic();
    renderHero();
    renderProfile();
    renderExperience();
    renderProjects();
    renderContact();
}

function setLang(next, { animate = true } = {}) {
    if (next === lang) {
        return;
    }

    lang = next;

    try {
        localStorage.setItem('lang', lang);
    } catch (error) {
        // Sin persistencia: no es critico.
    }

    if (animate && document.startViewTransition && !reducedMotion.matches) {
        document.startViewTransition(renderAll);
    } else {
        renderAll();
    }
}

const menuButton = $('.menu-toggle');
const nav = $('#site-nav');
const mobileQuery = window.matchMedia('(max-width: 859px)');

function syncMenuLabel() {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-label', isOpen ? ui('menuClose') : ui('menuOpen'));
}

function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    syncMenuLabel();
}

function initMenu() {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuButton.focus();
        }
    });

    mobileQuery.addEventListener('change', (event) => {
        if (!event.matches) {
            setMenu(false);
        }
    });
}

// GTM se carga tras la primera interaccion o pasados unos segundos, para que no compita con el render inicial.
function loadAnalytics() {
    let loaded = false;

    const load = () => {
        if (loaded) {
            return;
        }

        loaded = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
        document.head.appendChild(script);
    };

    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((type) => {
        window.addEventListener(type, load, { once: true, passive: true });
    });

    window.addEventListener('load', () => setTimeout(load, 4000), { once: true });
}

function init() {
    lang = detectLang();
    renderAll();
    initMenu();
    $('#lang-toggle').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));
    loadAnalytics();
}

init();
