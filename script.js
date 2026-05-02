// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        // Trigger hero section visible
        document.querySelector('#home').classList.add('visible');
        startHeroCounters();
    }, 1200);
});
 
// ===== ANIMATED PARTICLES =====
function createParticles() {
    const bg = document.getElementById('animatedBg');
    const count = 25;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 120 + 40;
        Object.assign(p.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 20 + 15}s`,
        });
        bg.appendChild(p);
    }
}
createParticles();
 
// ===== CUSTOM CURSOR =====
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
 
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});
 
function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();
 
const hoverTargets = document.querySelectorAll(
    'a, button, .skill-badge, .tech-icon-item, .theme-option, .contact-btn, .project-card'
);
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorRing.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
    });
});
 
// ===== TYPING EFFECT =====
const titles = [
    'Software Engineer',
    'Web Developer',
    'Cybersecurity Enthusiast',
    'UI/UX Designer',
    'Open Source Contributor'
];
let titleIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');
 
function typeWriter() {
    const current = titles[titleIdx];
    if (isDeleting) {
        charIdx--;
    } else {
        charIdx++;
    }
    typingEl.innerHTML = current.slice(0, charIdx) + '<span class="cursor-blink"></span>';
 
    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIdx === current.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        delay = 400;
    }
    setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 1500);
 
// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});
 
// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const overlay   = document.getElementById('overlay');
 
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
});

document.getElementById('navCloseBtn').addEventListener('click', closeMenu);
 
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});
overlay.addEventListener('click', () => {
    closeMenu();
    closeThemePalette();
});
 
function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
}
 
// ===== DARK / LIGHT MODE =====
const htmlEl           = document.documentElement;
const darkModeBtn      = document.getElementById('darkModeBtn');
const darkModeBtnMob   = document.getElementById('darkModeBtnMobile');
const darkModeIcon     = document.getElementById('darkModeIcon');
const darkModeIconMob  = document.getElementById('darkModeIconMobile');
 
const savedMode = localStorage.getItem('colorMode') || 'dark';
applyMode(savedMode);
 
function applyMode(mode) {
    htmlEl.setAttribute('data-theme', mode);
    const isDark = mode === 'dark';
    const iconClass = isDark ? 'fa-moon' : 'fa-sun';
    [darkModeIcon, darkModeIconMob].forEach(ic => {
        ic.className = `fas ${iconClass}`;
    });
    localStorage.setItem('colorMode', mode);
}
 
function toggleMode() {
    const current = htmlEl.getAttribute('data-theme');
    applyMode(current === 'dark' ? 'light' : 'dark');
}
darkModeBtn.addEventListener('click', toggleMode);
darkModeBtnMob.addEventListener('click', toggleMode);
 
// ===== THEME SWITCHER =====
const themeSwitcher  = document.getElementById('themeSwitcher');
const themePalette   = document.getElementById('themePalette');
const closePaletteBtn = document.getElementById('closePalette');
const themeOptions   = document.querySelectorAll('.theme-option');
 
function openThemePalette() {
    themePalette.classList.add('active');
    overlay.classList.add('active');
}
function closeThemePalette() {
    themePalette.classList.remove('active');
    overlay.classList.remove('active');
}
 
themeSwitcher.addEventListener('click', openThemePalette);
closePaletteBtn.addEventListener('click', closeThemePalette);
 
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        // Strip theme classes, keep mode-related attrs
        document.body.className = '';
        if (theme !== 'default') document.body.classList.add(`theme-${theme}`);
        themeOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        localStorage.setItem('selectedTheme', theme);
        closeThemePalette();
    });
});
 
// Load saved theme
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme && savedTheme !== 'default') {
    document.body.classList.add(`theme-${savedTheme}`);
    themeOptions.forEach(o => {
        o.classList.toggle('active', o.dataset.theme === savedTheme);
    });
}
 
// ===== EXPAND / COLLAPSE =====
function setupExpand(btnId, containerId, expandText, collapseText) {
    const btn  = document.getElementById(btnId);
    const cont = document.getElementById(containerId);
    let expanded = false;
    btn.addEventListener('click', () => {
        expanded = !expanded;
        cont.classList.toggle('expanded', expanded);
        btn.classList.toggle('active', expanded);
        const icon = btn.querySelector('i');
        btn.innerHTML = expanded
            ? `<i class="fas fa-chevron-up"></i> ${collapseText}`
            : `<i class="fas fa-chevron-down"></i> ${expandText}`;
    });
}
setupExpand('expandProjects', 'moreProjects', 'View More Projects', 'Show Less');
setupExpand('expandApps',     'moreApps',     'View More Apps',     'Show Less');
 
// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        closeMenu();
    });
});
 
// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
 
document.querySelectorAll('section').forEach(s => revealObserver.observe(s));
 
// ===== SKILL PROGRESS BARS + PERCENTAGE COUNTER =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const width = bar.dataset.width;
        // Animate bar width
        requestAnimationFrame(() => {
            bar.style.width = width + '%';
        });
        // Animate percentage counter
        const pctEl = bar.closest('.skill-item').querySelector('.skill-percentage');
        if (pctEl) animateCounter(pctEl, 0, parseInt(width), 1400, '%');
        skillObserver.unobserve(bar);
    });
}, { threshold: 0.4 });
 
document.querySelectorAll('.skill-progress').forEach(bar => skillObserver.observe(bar));
 
function animateCounter(el, from, to, duration, suffix = '') {
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.round(from + (to - from) * ease);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
 
// ===== HERO STAT COUNTERS =====
function startHeroCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, 0, target, 1600);
    });
}
 
// ===== 3D CARD TILT =====
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 8;
        const rotY = dx * 8;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
        card.style.boxShadow = `
            ${-rotY * 2}px ${rotX * 2}px 40px var(--shadow-glow),
            0 20px 60px rgba(0,0,0,0.3)
        `;
        // Move glow to cursor position
        const glow = card.querySelector('.card-glow');
        if (glow) {
            const gx = e.clientX - rect.left;
            const gy = e.clientY - rect.top;
            glow.style.left = gx + 'px';
            glow.style.top  = gy + 'px';
            glow.style.opacity = '0.18';
        }
    });
 
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.boxShadow = '';
        const glow = card.querySelector('.card-glow');
        if (glow) glow.style.opacity = '0';
    });
});
 
// ===== STAGGER ANIMATION FOR GRID ITEMS =====
const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.querySelectorAll('.project-card, .skill-category');
        children.forEach((child, i) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, i * 120);
        });
        gridObserver.unobserve(entry.target);
    });
}, { threshold: 0.1 });
 
document.querySelectorAll('.projects-grid, .skills-container').forEach(grid => {
    const children = grid.querySelectorAll('.project-card, .skill-category');
    children.forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    gridObserver.observe(grid);
});
 
// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
 
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
    });
    navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current
            ? 'var(--primary-light)'
            : '';
    });
}, { passive: true });