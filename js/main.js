const CONTENT = window.PORTFOLIO_CONTENT || {};
const PROJECTS = window.PORTFOLIO_PROJECTS || [];
const LANGS = ['es', 'en'];
const GTM_ID = 'GTM-NKQC82H';

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

    tech.forEach((name) => fragment.appendChild(el('li', '', name)));

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
}

function renderStack() {
    const stackGroups = $('#stack-groups');
    stackGroups.replaceChildren();

    (CONTENT.stackGroups || []).forEach((group) => {
        const row = el('div', 'stack__row');
        const list = el('ul', 'chip-list');

        group.items.forEach((item) => list.appendChild(el('li', '', item)));
        row.append(el('h3', 'stack__title', pick(group.title)), list);
        stackGroups.appendChild(row);
    });
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

        item.append(heading, el('p', 'timeline__role', pick(job.role)), el('p', 'timeline__context', pick(job.context)), bullets);
        experienceList.appendChild(item);
    });

    $('#earlier').textContent = pick(CONTENT.earlier);

    (CONTENT.education || []).forEach((entry) => {
        const item = el('li', 'education__item');
        item.append(el('p', 'education__title', pick(entry.title)), el('p', 'education__school', entry.school));

        if (entry.note) {
            item.appendChild(el('p', 'education__note', pick(entry.note)));
        }

        educationList.appendChild(item);
    });
}

function renderProject(project) {
    const template = document.getElementById('project-card-template');
    const clone = template.content.cloneNode(true);
    const image = $('.card__image', clone);
    const link = $('.card__link', clone);

    image.src = project.image;
    image.alt = ui('previewAlt').replace('{title}', project.title);
    image.width = project.width;
    image.height = project.height;

    $('.card__context', clone).textContent = pick(project.context);
    $('.card__title', clone).textContent = project.title;
    $('.card__summary', clone).textContent = pick(project.summary);
    $('.tech-pills', clone).appendChild(createTechPills(project.tech));

    link.href = project.url;
    link.setAttribute('aria-label', ui('viewProjectLabel').replace('{title}', project.title));
    $('span', link).textContent = ui('viewProject');

    return clone;
}

function renderProjects() {
    const grid = $('#projects-grid');

    grid.replaceChildren();
    PROJECTS.forEach((project) => grid.appendChild(renderProject(project)));
}

function renderContact() {
    const container = $('#contact-grid');
    const contact = CONTENT.contact || {};

    container.replaceChildren();

    const cards = [
        { label: 'Email', value: contact.email, icon: './img/mensaje.svg', href: `mailto:${contact.email}` },
        { label: 'LinkedIn', value: 'linkedin.com/in/benimoralessilva', icon: './img/linkedin.svg', href: contact.linkedin },
        { label: 'GitHub', value: 'github.com/bm-code', icon: './img/github.svg', href: contact.github },
        { label: ui('cvLabel'), value: ui('cvValue'), icon: './img/cv.svg', href: contact.cv, download: true }
    ];

    cards.forEach((item) => {
        const card = el(item.href ? 'a' : 'div', 'contact-card');

        if (item.href) {
            card.href = item.href;

            if (item.download) {
                card.target = '_blank';
                card.rel = 'noopener';
            } else if (!item.href.startsWith('mailto:')) {
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
    renderStack();
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

function initCursorTrail() {
    const canvas = document.getElementById('cursor-trail');

    if (!canvas) {
        return;
    }

    const disableTrail =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (disableTrail) {
        canvas.remove();
        return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
        canvas.remove();
        return;
    }

    let dpr = 1;
    let width = 0;
    let height = 0;

    const pointer = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.24,
        targetX: window.innerWidth * 0.5,
        targetY: window.innerHeight * 0.24
    };

    const trail = Array.from({ length: 14 }, () => ({ x: pointer.x, y: pointer.y }));
    const particles = [];
    const maxParticles = 260;

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setSpotlight = (x, y) => {
        document.documentElement.style.setProperty('--cursor-x', `${x}px`);
        document.documentElement.style.setProperty('--cursor-y', `${y}px`);
    };

    const spawnParticles = (x, y, velocity) => {
        const amount = Math.max(2, Math.min(12, Math.round(velocity / 4) + 2));

        for (let i = 0; i < amount; i += 1) {
            const angle = Math.random() * Math.PI * 2;
            const force = 0.28 + Math.random() * 1.1 + velocity * 0.008;

            particles.push({
                x,
                y,
                vx: Math.cos(angle) * force,
                vy: Math.sin(angle) * force,
                radius: 2 + Math.random() * 7,
                alpha: 0.4 + Math.random() * 0.45,
                decay: 0.012 + Math.random() * 0.02
            });
        }

        if (particles.length > maxParticles) {
            particles.splice(0, particles.length - maxParticles);
        }
    };

    const updateTrail = () => {
        pointer.x += (pointer.targetX - pointer.x) * 0.3;
        pointer.y += (pointer.targetY - pointer.y) * 0.3;

        trail[0].x = pointer.x;
        trail[0].y = pointer.y;

        for (let i = 1; i < trail.length; i += 1) {
            const previous = trail[i - 1];
            trail[i].x += (previous.x - trail[i].x) * 0.45;
            trail[i].y += (previous.y - trail[i].y) * 0.45;
        }
    };

    const drawTrailLine = () => {
        for (let i = 0; i < trail.length - 1; i += 1) {
            const current = trail[i];
            const next = trail[i + 1];
            const alpha = 0.28 - i * 0.015;

            if (alpha <= 0) {
                continue;
            }

            context.strokeStyle = `rgba(67, 247, 212, ${alpha})`;
            context.lineWidth = Math.max(1.2, 10 - i * 0.62);
            context.lineCap = 'round';

            context.beginPath();
            context.moveTo(current.x, current.y);
            context.lineTo(next.x, next.y);
            context.stroke();
        }
    };

    const drawParticles = () => {
        for (let i = particles.length - 1; i >= 0; i -= 1) {
            const particle = particles[i];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.94;
            particle.vy *= 0.94;
            particle.alpha -= particle.decay;
            particle.radius *= 0.986;

            if (particle.alpha <= 0.02 || particle.radius <= 0.35) {
                particles.splice(i, 1);
                continue;
            }

            const glow = context.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.radius * 2.6
            );

            glow.addColorStop(0, `rgba(67, 247, 212, ${particle.alpha})`);
            glow.addColorStop(0.5, `rgba(67, 247, 212, ${particle.alpha * 0.36})`);
            glow.addColorStop(1, 'rgba(67, 247, 212, 0)');

            context.fillStyle = glow;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius * 2.6, 0, Math.PI * 2);
            context.fill();
        }
    };

    const render = () => {
        context.clearRect(0, 0, width, height);
        updateTrail();
        drawTrailLine();
        drawParticles();
        requestAnimationFrame(render);
    };

    resize();
    setSpotlight(pointer.x, pointer.y);

    window.addEventListener('resize', resize);

    window.addEventListener('pointermove', (event) => {
        const deltaX = event.clientX - pointer.targetX;
        const deltaY = event.clientY - pointer.targetY;
        const velocity = Math.hypot(deltaX, deltaY);

        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;

        setSpotlight(event.clientX, event.clientY);
        spawnParticles(event.clientX, event.clientY, velocity);
    });

    window.addEventListener('pointerdown', () => {
        spawnParticles(pointer.targetX, pointer.targetY, 18);
    });

    render();
}

function init() {
    lang = detectLang();
    renderAll();
    initMenu();
    $('#lang-toggle').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));
    initCursorTrail();
    loadAnalytics();
}

init();
