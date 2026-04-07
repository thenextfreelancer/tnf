// Main JavaScript for TheNextFreelancer

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all article cards and sections
document.querySelectorAll('article, section > div').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// External link handling
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Reading progress bar (for blog posts)
if (document.querySelector('article.blog-post')) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #FF3366, #E62E5C);
        width: 0%;
        z-index: 100;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = (window.scrollY / documentHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Copy code button for code blocks
document.querySelectorAll('pre code').forEach((block) => {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.textContent = 'Copy';
    button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: #121212;
        border: 1px solid #27272A;
        color: #A1A1AA;
        font-size: 0.75rem;
        border-radius: 2px;
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
    `;
    
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            button.style.color = '#FF3366';
            setTimeout(() => {
                button.textContent = 'Copy';
                button.style.color = '#A1A1AA';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Lazy loading images with fade-in
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s';
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console easter egg
console.log(`
%c█▀▀█ █░░█ █▀▀ █▀▀▄ █▀▀ █░█ ▀▀█▀▀   █▀▀ █▀▀█ █▀▀ █▀▀ █░░ █▀▀█ █▀▀▄ █▀▀ █▀▀ █▀▀█
%c█░░█ █▀▀█ █▀▀ █░░█ █▀▀ ▄▀▄ ░░█░░   █▀▀ █▄▄▀ █▀▀ █▀▀ █░░ █▄▄█ █░░█ █░░ █▀▀ █▄▄▀
%c▀▀▀▀ ▀░░▀ ▀▀▀ ▀░░▀ ▀▀▀ ▀░▀ ░░▀░░   ▀░░ ▀░▀▀ ▀▀▀ ▀▀▀ ▀▀▀ ▀░░▀ ▀░░▀ ▀▀▀ ▀▀▀ ▀░▀▀

%cBuilt with HTML, CSS, and JavaScript
%cFollow @thenextfreelancer for AI freelancing tips
`,
'color: #FF3366; font-weight: bold;',
'color: #FF3366; font-weight: bold;',
'color: #FF3366; font-weight: bold;',
'color: #FFFFFF; font-size: 12px;',
'color: #A1A1AA; font-size: 11px;'
);