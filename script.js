/* ======================================
   TraQQr — Script
   Scroll reveals, language toggle, nav, industry tabs, counters
   ====================================== */

(function () {
    'use strict';

    // --- Scroll reveal ---
    var reveals = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });

    // --- Nav scroll effect ---
    var nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        }, { passive: true });
    }

    // --- Mobile menu ---
    var menuBtn = document.getElementById('navMenu');
    var mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Language toggle ---
    var currentLang = localStorage.getItem('traqqr-lang') || 'nl';
    var toggles = document.querySelectorAll('.lang-toggle');
    var translatables = document.querySelectorAll('[data-nl]');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('traqqr-lang', lang);
        document.documentElement.lang = lang;

        translatables.forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });

        toggles.forEach(function (btn) {
            btn.textContent = lang === 'nl' ? 'EN' : 'NL';
        });

        // Update page title
        var titleEl = document.querySelector('title');
        if (titleEl && titleEl.getAttribute('data-' + lang)) {
            document.title = titleEl.getAttribute('data-' + lang);
        }
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setLanguage(currentLang === 'nl' ? 'en' : 'nl');
        });
    });

    // Apply saved language on load
    if (translatables.length > 0) {
        setLanguage(currentLang);
    }

    // --- Industry tabs ---
    var tabs = document.querySelectorAll('.industry-tab');
    var panels = document.querySelectorAll('.industry-panel');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = tab.getAttribute('data-tab');

            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            panels.forEach(function (p) { p.classList.remove('active'); });
            var panel = document.getElementById('panel-' + target);
            if (panel) panel.classList.add('active');
        });
    });

    // --- Counter animation ---
    var counters = document.querySelectorAll('[data-count]');
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });

    function animateCounter(el, target) {
        var duration = 1500;
        var start = performance.now();
        var format = target >= 1000;

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(eased * target);
            el.textContent = format ? value.toLocaleString() : value;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = nav ? nav.offsetHeight + 20 : 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax glow on mouse move (desktop only) ---
    var glow = document.querySelector('.hero__glow');
    if (glow && window.matchMedia('(min-width: 768px)').matches) {
        document.addEventListener('mousemove', function (e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 50;
            var y = (e.clientY / window.innerHeight - 0.5) * 50;
            glow.style.transform = 'translateX(calc(-50% + ' + x + 'px)) translateY(' + y + 'px)';
        }, { passive: true });
    }

    // --- Contact form handling ---
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var formEl = document.getElementById('contactFormInner');
            var success = document.getElementById('contactSuccess');
            if (formEl && success) {
                formEl.classList.add('hidden');
                success.classList.remove('hidden');
            }
        });
    }

})();
