const CONTENT = window.PORTFOLIO_CONTENT || {};
const PROJECTS = window.PORTFOLIO_PROJECTS || [];
const SHOW_SECONDARY_LANGUAGE = false;

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

function langPairHTML(pair = {}, options = {}) {
    const showSecondary = options.showSecondary ?? SHOW_SECONDARY_LANGUAGE;
    const es = pair.es || '';
    const en = pair.en || '';

    if (!showSecondary || !en) {
        return `<span class="es">${es}</span>`;
    }

    return `<span class="es">${es}</span><span class="en">${en}</span>`;
}

function setLangPair(node, pair, options = {}) {
    if (!node) {
        return;
    }

    node.classList.add('lang-pair');
    node.innerHTML = langPairHTML(pair, options);

    if (!SHOW_SECONDARY_LANGUAGE && pair?.en) {
        node.setAttribute('title', pair.en);
    }
}

function createTechPills(tech = []) {
    const fragment = document.createDocumentFragment();

    tech.forEach((name) => {
        const item = document.createElement('li');
        const iconPath = TECH_ICONS[name];

        if (iconPath) {
            const icon = document.createElement('img');
            icon.src = iconPath;
            icon.alt = name;
            item.appendChild(icon);
        }

        const text = document.createElement('span');
        text.textContent = name;
        item.appendChild(text);
        fragment.appendChild(item);
    });

    return fragment;
}

function renderHero() {
    const hero = CONTENT.hero;

    if (!hero) {
        return;
    }

    const kicker = document.getElementById('hero-kicker');
    const title = document.getElementById('hero-title');
    const role = document.getElementById('hero-role');
    const intro = document.getElementById('hero-intro');
    const line = document.getElementById('hero-line');
    const badges = document.getElementById('hero-badges');
    const marqueeTrack = document.getElementById('hero-marquee-track');
    const heroEmail = document.getElementById('hero-email');
    const heroLinkedin = document.getElementById('hero-linkedin');

    setLangPair(kicker, hero.kicker);

    if (title) {
        title.textContent = hero.title || '';
    }

    setLangPair(role, hero.role);
    setLangPair(intro, hero.intro);
    setLangPair(line, hero.line);

    if (Array.isArray(hero.badges) && badges) {
        hero.badges.forEach((badge) => {
            const item = document.createElement('li');
            item.textContent = badge;
            badges.appendChild(item);
        });
    }

    if (Array.isArray(hero.marquee) && marqueeTrack) {
        const allMarqueeItems = [...hero.marquee, ...hero.marquee];

        allMarqueeItems.forEach((text) => {
            const item = document.createElement('span');
            item.className = 'hero__marquee-item';
            item.textContent = text;
            marqueeTrack.appendChild(item);
        });
    }

    if (heroEmail && CONTENT.contact?.email) {
        heroEmail.textContent = CONTENT.contact.email;
        heroEmail.href = `mailto:${CONTENT.contact.email}`;
    }

    if (heroLinkedin && CONTENT.contact?.linkedin) {
        heroLinkedin.href = CONTENT.contact.linkedin;
    }
}

function renderStatements() {
    const container = document.getElementById('statement-grid');

    if (!container || !Array.isArray(CONTENT.statements)) {
        return;
    }

    CONTENT.statements.slice(0, 2).forEach((statement) => {
        const article = document.createElement('article');
        article.className = 'statement__item';

        article.innerHTML = `<span class="es">${statement.es}</span>`;

        container.appendChild(article);
    });
}

function renderProfile() {
    const profileSummary = document.getElementById('profile-summary');
    const stackGroups = document.getElementById('stack-groups');
    const whyList = document.getElementById('why-list');

    setLangPair(profileSummary, CONTENT.profileSummary);

    if (stackGroups && Array.isArray(CONTENT.stackGroups)) {
        CONTENT.stackGroups.forEach((group) => {
            const card = document.createElement('article');
            card.className = 'stack-card';

            const title = document.createElement('h3');
            title.textContent = group.title;

            const list = document.createElement('ul');
            list.className = 'stack-chip-list';

            group.items.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });

            card.append(title, list);
            stackGroups.appendChild(card);
        });
    }

    if (whyList && Array.isArray(CONTENT.whyMe)) {
        CONTENT.whyMe.slice(0, 3).forEach((item) => {
            const li = document.createElement('li');
            li.className = 'lang-pair';
            li.innerHTML = langPairHTML(item);
            whyList.appendChild(li);
        });
    }
}

function renderExperience() {
    const experienceList = document.getElementById('experience-list');
    const educationList = document.getElementById('education-list');

    if (experienceList && Array.isArray(CONTENT.experience)) {
        CONTENT.experience.forEach((job) => {
            const card = document.createElement('article');
            card.className = 'entry-card';

            const heading = document.createElement('div');
            heading.className = 'entry-card__heading';

            const company = document.createElement('p');
            company.className = 'entry-card__company';
            company.textContent = job.company;

            const period = document.createElement('p');
            period.className = 'entry-card__period lang-pair';
            period.innerHTML = langPairHTML(job.period);

            heading.append(company, period);

            const role = document.createElement('p');
            role.className = 'entry-card__role lang-pair';
            role.innerHTML = langPairHTML(job.role);

            const bullets = document.createElement('ul');
            bullets.className = 'entry-card__bullets';

            job.bullets.slice(0, 2).forEach((bullet) => {
                const li = document.createElement('li');
                li.className = 'lang-pair';
                li.innerHTML = langPairHTML(bullet);
                bullets.appendChild(li);
            });

            card.append(heading, role, bullets);
            experienceList.appendChild(card);
        });
    }

    if (educationList && Array.isArray(CONTENT.education)) {
        CONTENT.education.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'entry-card';

            const degree = document.createElement('p');
            degree.className = 'entry-card__role lang-pair';
            degree.innerHTML = langPairHTML(item.title);

            const school = document.createElement('p');
            school.className = 'entry-card__period';
            school.textContent = item.school;

            card.append(degree, school);
            educationList.appendChild(card);
        });
    }
}

function renderFeaturedProject(project, index) {
    const template = document.getElementById('featured-card-template');

    if (!template) {
        return null;
    }

    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('.featured-card');

    if (index % 2 !== 0) {
        card.classList.add('featured-card--reverse');
    }

    card.querySelector('.featured-card__image').src = project.image;
    card.querySelector('.featured-card__image').alt = `Preview ${project.title}`;
    card.querySelector('.featured-card__year').textContent = project.year;
    card.querySelector('.featured-card__role').textContent = project.role;
    card.querySelector('.featured-card__title').textContent = project.title;

    setLangPair(clone.querySelector('.featured-card__summary'), project.summary);
    const note = clone.querySelector('.featured-card__note');
    note.textContent = project.highlights?.[0]?.es || '';

    const tech = clone.querySelector('.featured-card__tech');
    tech.appendChild(createTechPills(project.tech));

    const link = clone.querySelector('.featured-card__link');
    link.href = project.url;

    return clone;
}

function renderArchiveProject(project) {
    const template = document.getElementById('archive-card-template');

    if (!template) {
        return null;
    }

    const clone = template.content.cloneNode(true);

    clone.querySelector('.archive-card__image').src = project.image;
    clone.querySelector('.archive-card__image').alt = `Preview ${project.title}`;
    clone.querySelector('.archive-card__meta').textContent = `${project.year} · ${project.role}`;
    clone.querySelector('.archive-card__title').textContent = project.title;

    setLangPair(clone.querySelector('.archive-card__summary'), project.summary);

    const tech = clone.querySelector('.archive-card__tech');
    tech.appendChild(createTechPills(project.tech));

    const link = clone.querySelector('.archive-card__link');
    link.href = project.url;

    return clone;
}

function renderProjects() {
    const featuredProjects = document.getElementById('featured-projects');
    const archiveProjects = document.getElementById('archive-projects');

    if (!featuredProjects || !archiveProjects || !Array.isArray(PROJECTS)) {
        return;
    }

    const featured = PROJECTS.filter((project) => project.tier === 'featured');
    const archive = PROJECTS.filter((project) => project.tier === 'archive');

    featured.forEach((project, index) => {
        const node = renderFeaturedProject(project, index);

        if (node) {
            featuredProjects.appendChild(node);
        }
    });

    archive.forEach((project) => {
        const node = renderArchiveProject(project);

        if (node) {
            archiveProjects.appendChild(node);
        }
    });
}

function renderContact() {
    const container = document.getElementById('contact-grid');

    if (!container || !CONTENT.contact) {
        return;
    }

    const cards = [
        {
            label: 'Email',
            value: CONTENT.contact.email,
            icon: './img/mensaje.svg',
            href: `mailto:${CONTENT.contact.email}`
        },
        {
            label: 'LinkedIn',
            value: 'linkedin.com/in/benimoralessilva',
            icon: './img/linkedin.svg',
            href: CONTENT.contact.linkedin
        },
        {
            label: 'GitHub',
            value: 'github.com/bm-code',
            icon: './img/github.svg',
            href: CONTENT.contact.github
        },
        {
            label: 'Location',
            value: CONTENT.contact.location,
            icon: './img/location.svg'
        }
    ];

    cards.forEach((item) => {
        const card = document.createElement(item.href ? 'a' : 'article');

        card.className = 'contact-card';

        if (item.href) {
            card.href = item.href;

            if (!item.href.startsWith('mailto:')) {
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
            }
        }

        const icon = document.createElement('img');
        icon.src = item.icon;
        icon.alt = item.label;

        const textWrap = document.createElement('div');
        const label = document.createElement('p');
        label.className = 'contact-card__label';
        label.textContent = item.label;

        const value = document.createElement('p');
        value.className = 'contact-card__value';
        value.textContent = item.value;

        textWrap.append(label, value);
        card.append(icon, textWrap);

        container.appendChild(card);
    });
}

function renderFooter() {
    const footerLine = document.getElementById('footer-line');
    setLangPair(footerLine, CONTENT.footer, { showSecondary: false });
}

function initMobileMenu() {
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');

    if (!menuButton || !nav) {
        return;
    }

    const closeMenu = () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
    };

    menuButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 860 || !nav.classList.contains('is-open')) {
            return;
        }

        if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMenu();
        }
    });
}

function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -6% 0px'
        }
    );

    revealElements.forEach((element) => observer.observe(element));
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

function bootstrapPortfolio() {
    renderHero();
    renderStatements();
    renderProfile();
    renderExperience();
    renderProjects();
    renderContact();
    renderFooter();
    initMobileMenu();
    initRevealOnScroll();
    initCursorTrail();
}

bootstrapPortfolio();
