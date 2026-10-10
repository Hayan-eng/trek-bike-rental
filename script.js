'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ============ Year in Footer ============ */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============ Header Scroll ============ */
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ============ Mobile Menu ============ */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    const closeMenu = () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'فتح القائمة');
    };

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('active', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) &&
            !burger.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });

    /* ============ Active Nav on Scroll ============ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                // Treat #booking as "الرئيسية" too since trips has no link requirement
                let matchId = id;
                if (id === 'features' || id === 'booking') matchId = 'hero';

                navLinks.forEach(l => {
                    const href = l.getAttribute('href');
                    l.classList.toggle('active',
                        href === `#${id}` || href === `#${matchId}`
                    );
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(sec => observerNav.observe(sec));

    /* ============ Reveal on Scroll ============ */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => revealObs.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ============ Book/Order Button → Prefill form ============ */
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.dataset.item || '';
            const select = document.getElementById('item');
            const booking = document.getElementById('booking');

            // Safe option matching
            [...select.options].forEach(opt => {
                if (opt.value === itemName || opt.textContent.trim() === itemName) {
                    select.value = opt.value || opt.textContent;
                }
            });

            booking.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => document.getElementById('name').focus(), 600);
        });
    });

    /* ============ Form Validation & Submit ============ */
    const form = document.getElementById('bookingForm');
    const msg = document.getElementById('formMsg');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const clean = (str) => String(str).replace(/[<>]/g, '').trim();

            const data = {
                name: clean(form.name.value),
                phone: clean(form.phone.value),
                item: clean(form.item.value),
                hours: parseInt(form.hours.value, 10) || 1,
                notes: clean(form.notes.value)
            };

            if (data.name.length < 3) {
                return showMsg('الرجاء إدخال اسم صحيح (3 أحرف على الأقل).', 'error');
            }
            if (!/^[0-9+\s-]{8,}$/.test(data.phone)) {
                return showMsg('الرجاء إدخال رقم هاتف صحيح.', 'error');
            }
            if (!data.item) {
                return showMsg('الرجاء اختيار المنتج أو الدراجة.', 'error');
            }

            showMsg(`✅ تم استلام طلبك يا ${data.name}! سنتواصل معك قريباً.`, 'success');
            form.reset();

            // اختياري: إرسال الطلب عبر واتساب
            // const waText = encodeURIComponent(
            //   `طلب جديد:\nالاسم: ${data.name}\nالهاتف: ${data.phone}\nالمنتج: ${data.item}\nالساعات: ${data.hours}\nملاحظات: ${data.notes}`
            // );
            // window.open(`https://wa.me/963900000000?text=${waText}`, '_blank', 'noopener');
        });

        function showMsg(text, type) {
            msg.textContent = text;
            msg.className = `form__msg ${type}`;
            setTimeout(() => { msg.textContent = ''; msg.className = 'form__msg'; }, 6000);
        }
    }

    /* ============ Smooth Scroll ============ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target && this.getAttribute('href') !== '#') {
                e.preventDefault();
                const headerOffset = 80;
                const pos = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });
});