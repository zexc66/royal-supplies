document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navigation ---
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        // Clone Portal Button and CTA into mobile menu for better B2B UX
        const mobileMenuPortal = document.querySelector('.header-actions .nav-portal-btn');
        if (mobileMenuPortal) {
            const portalClone = mobileMenuPortal.cloneNode(true);
            portalClone.className = 'mobile-portal-btn';
            const svg = portalClone.querySelector('svg');
            if (svg) {
                svg.style.stroke = 'var(--color-gold-primary)';
            }
            const li = document.createElement('li');
            li.className = 'mobile-portal-li';
            li.appendChild(portalClone);
            navLinks.appendChild(li);
        }

        const mobileMenuCta = document.querySelector('.header-actions .nav-cta');
        if (mobileMenuCta) {
            const ctaClone = mobileMenuCta.cloneNode(true);
            ctaClone.className = 'mobile-cta-btn';
            const li = document.createElement('li');
            li.className = 'mobile-cta-li';
            li.appendChild(ctaClone);
            navLinks.appendChild(li);
        }

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = navToggle.querySelectorAll('span');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
            } else {
                document.body.style.overflow = 'auto';
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Infinite Logo Loop Cloning ---
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        // Clone items to ensure seamless loop
        const marqueeItems = Array.from(marqueeTrack.children);
        marqueeItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            marqueeTrack.appendChild(clone);
        });
    }

    // --- LocalStorage CMS Setup (Seed Default Data) ---
    const defaultArticles = [
        { id: 1, title: "Workplace Vitality: Why Premium Coffee is a Strategic Advantage for Egypt's Tech Hubs", titleAr: 'حيوية بيئة العمل: لماذا تعد القهوة الفاخرة ميزة استراتيجية للشركات التقنية بمصر', date: 'July 14, 2026', author: 'B2B Procurement', desc: "In Egypt's fast-growing tech parks, from Smart Village to New Cairo, premium breakroom espresso and tea programs are essential tools for retaining top software talent and enhancing administrative productivity.", descAr: 'في مجمعات التكنولوجيا المتسارعة بمصر من القرية الذكية إلى القاهرة الجديدة، تعد برامج تموين الإسبريسو والشاي الفاخر أداة أساسية للحفاظ على الكفاءات البرمجية وتنشيط الموظفين.', image: 'assets/b2b-pantry-restock.png' },
        { id: 2, title: 'Sustainable Procurement: Transitioning to FSC-Certified Paper & Eco-Conscious Printing', titleAr: 'المشتريات المستدامة: الانتقال للأوراق المعتمدة والطباعة صديقة البيئة بالشركات', date: 'July 16, 2026', author: 'Logistics Team', desc: 'A guide for facility procurement managers in Heliopolis and Alexandria on choosing FSC-certified paper reams and eco-friendly toner cartridges to hit global ESG compliance standards.', descAr: 'دليل مبسط لمديري المشتريات والمرافق في مصر الجديدة والإسكندرية لاختيار رزم أوراق التصوير المعتمدة بيئياً وأحبار الليزر المعاد تدويرها لتحقيق معايير الاستدامة البيئية.', image: 'assets/b2b-office-supplies.png' }
    ];

    // Seed database with localization upgrade check
    if (!localStorage.getItem('royal_localized_egypt_v4')) {
        localStorage.removeItem('royal_products');
        localStorage.removeItem('royal_articles');
        localStorage.setItem('royal_localized_egypt_v4', 'true');
    }

    if (!localStorage.getItem('royal_articles')) {
        localStorage.setItem('royal_articles', JSON.stringify(defaultArticles));
    }
    if (!localStorage.getItem('royal_submissions')) {
        localStorage.setItem('royal_submissions', JSON.stringify([]));
    }

    // Get current language context
    const isArabic = document.documentElement.getAttribute('dir') === 'rtl';

    // --- Dynamic Render: News & Insights Page ---
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        const renderNews = () => {
            const articles = JSON.parse(localStorage.getItem('royal_articles')) || [];
            newsContainer.innerHTML = '';
            
            if (articles.length === 0) {
                newsContainer.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 40px 0;">No articles available.</p>`;
                return;
            }

            articles.forEach(art => {
                const title = isArabic ? art.titleAr : art.title;
                const desc = isArabic ? art.descAr : art.desc;
                const readBtn = isArabic ? 'اقرأ المزيد' : 'Read Article';
                
                const card = document.createElement('div');
                card.className = 'offering-card reveal active';
                card.style.padding = '0';
                card.style.overflow = 'hidden';
                card.style.flexDirection = 'column';
                
                card.innerHTML = `
                    <div style="height: 240px; overflow: hidden; background: #eae7e2;">
                        <img src="${art.image}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 12px;">
                            <span>${art.date}</span>
                            <span>By ${art.author}</span>
                        </div>
                        <h3 style="font-size: 1.35rem; margin-bottom: 12px;">${title}</h3>
                        <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 24px;">${desc}</p>
                        <a href="#" class="card-link" onclick="event.preventDefault(); alert('${isArabic ? 'هذه المقالة للتوضيح فقط.' : 'This article template is for presentation purposes.'}')">
                            ${readBtn}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                `;
                newsContainer.appendChild(card);
            });
        };
        renderNews();
    }

    // --- Forms Logging (Store Submissions to LocalStorage for Admin Review) ---
    const successModal = document.getElementById('successModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    const handleFormSubmission = (formId, type) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                data.type = type;
                data.timestamp = new Date().toLocaleString();
                data.id = 'SUB-' + Date.now();
                data.status = 'Pending';
                
                // Save to submissions log
                const submissions = JSON.parse(localStorage.getItem('royal_submissions')) || [];
                submissions.push(data);
                localStorage.setItem('royal_submissions', JSON.stringify(submissions));

                // Show success modal
                if (successModal && modalOverlay) {
                    successModal.classList.add('active');
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    alert(isArabic ? 'تم إرسال طلبك بنجاح. سيتواصل معك فريق الضيافة قريباً.' : 'Thank you. Your request has been successfully submitted.');
                }
                
                form.reset();
            });
        }
    };

    handleFormSubmission('corporateQuoteForm', 'RFQ');
    handleFormSubmission('generalContactForm', 'Contact Inquiry');
    handleFormSubmission('careerApplyForm', 'Job Application');

    if (modalCloseBtn && modalOverlay && successModal) {
        const closeModal = () => {
            successModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
    }

    // --- Search Overlay Logic (Bilingual client-side indexing) ---
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInputField = document.getElementById('searchInputField');
    const searchResultsList = document.getElementById('searchResultsList');

    if (searchTrigger && searchOverlay && searchClose && searchInputField && searchResultsList) {
        
        searchTrigger.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInputField.focus(), 300);
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            searchInputField.value = '';
            searchResultsList.innerHTML = '';
        };

        searchClose.addEventListener('click', closeSearch);
        
        // Listen for Esc key to close search
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        // Live Search Input Handler
        searchInputField.addEventListener('input', () => {
            const query = searchInputField.value.trim().toLowerCase();
            searchResultsList.innerHTML = '';
            
            if (query.length < 2) return;

            const articles = JSON.parse(localStorage.getItem('royal_articles')) || [];
            
            let matches = [];

            // Search articles
            articles.forEach(art => {
                const title = isArabic ? art.titleAr : art.title;
                const desc = isArabic ? art.descAr : art.desc;
                if (title.toLowerCase().includes(query) || desc.toLowerCase().includes(query)) {
                    matches.push({
                        title: title,
                        desc: desc,
                        category: isArabic ? 'رؤى وأخبار' : 'News & Insights',
                        url: `news${isArabic ? '-ar' : ''}.html`
                    });
                }
            });

            if (matches.length === 0) {
                searchResultsList.innerHTML = `<li style="text-align: center; color: var(--color-text-muted); padding: 20px 0;">${isArabic ? 'لم يتم العثور على نتائج تطابق بحثك.' : 'No matching results found.'}</li>`;
                return;
            }

            matches.forEach(item => {
                const li = document.createElement('li');
                li.className = 'search-result-item';
                li.innerHTML = `
                    <a href="${item.url}">
                        <div class="search-result-category">${item.category}</div>
                        <div class="search-result-title">${item.title}</div>
                        <div class="search-result-desc">${item.desc}</div>
                    </a>
                `;
                searchResultsList.appendChild(li);
            });
        });
    }


    // --- Restocking Estimator Tool (Quote Page Headcount Calculation) ---
    const employeesInput = document.getElementById('employeeCount');
    const estimateTotal = document.getElementById('estimateTotal');
    const sliderVal = document.getElementById('sliderVal');
    const restockFrequency = document.getElementById('restockFrequency');

    if (employeesInput && estimateTotal) {
        const updateCalculator = () => {
            const count = parseInt(employeesInput.value) || 0;
            if (sliderVal) {
                sliderVal.textContent = count;
            }
            
            // Category weight factors per employee per month
            let perEmployeeRate = 0;
            const checks = document.querySelectorAll('input[name="categories[]"]:checked');
            checks.forEach(chk => {
                const val = chk.value;
                if (val === 'pantry_coffee') perEmployeeRate += 20;
                else if (val === 'pantry_tea') perEmployeeRate += 10;
                else if (val === 'pantry_snacks') perEmployeeRate += 30;
                else if (val === 'pantry_cups') perEmployeeRate += 15;
                else if (val === 'office_paper') perEmployeeRate += 25;
                else if (val === 'office_ink') perEmployeeRate += 40;
            });
            
            // Frequency modifiers
            let freqMult = 1.0;
            if (restockFrequency) {
                const freq = restockFrequency.value;
                if (freq === 'weekly') freqMult = 1.25;
                else if (freq === 'biweekly') freqMult = 1.0;
                else if (freq === 'monthly') freqMult = 0.85;
                else if (freq === 'on-demand') freqMult = 1.1;
            }
            
            let estVal = '';
            if (count > 0 && perEmployeeRate > 0) {
                const baseCost = count * perEmployeeRate * freqMult;
                const lowRange = Math.round(baseCost * 0.85);
                const highRange = Math.round(baseCost * 1.15);
                estVal = isArabic 
                    ? `${lowRange.toLocaleString()} - ${highRange.toLocaleString()} جنيه` 
                    : `EGP ${lowRange.toLocaleString()} - ${highRange.toLocaleString()}`;
            } else {
                estVal = isArabic ? '0 جنيه' : 'EGP 0';
            }
            estimateTotal.textContent = estVal;
        };

        employeesInput.addEventListener('input', updateCalculator);
        if (restockFrequency) {
            restockFrequency.addEventListener('change', updateCalculator);
        }
        document.querySelectorAll('input[name="categories[]"]').forEach(chk => {
            chk.addEventListener('change', updateCalculator);
        });

        // Trigger initial load
        updateCalculator();
    }

    // --- Luxury B2B Concierge Panel Widget ---
    const conciergeContainer = document.createElement('div');
    conciergeContainer.className = 'luxury-concierge-widget';
    
    const waText = isArabic 
        ? 'مرحبا رويال سابلايز، نود الاستفسار عن خدمات التموين B2B للمؤسسات.'
        : 'Hello Royal Supplies, we would like to inquire about your B2B corporate restocking services.';
    const waHref = `https://wa.me/201002509988?text=${encodeURIComponent(waText)}`;
    
    const title = isArabic ? 'الكونسيرج الملكي' : 'Royal Concierge';
    const status = isArabic ? 'متصل حالياً' : 'Online';
    const welcome = isArabic 
        ? 'مرحباً بك في خدمة الكونسيرج لشركة رويال سابلايز. نوفر حلول تموين متكاملة للمؤسسات والشركات بمصر.'
        : 'Welcome to Royal Supplies B2B Concierge. Restocking solutions for Egypt\'s leading corporate spaces.';
    const waBtnText = isArabic ? 'المحادثة الفورية عبر واتساب' : 'Chat on WhatsApp';
    const altBtnText = isArabic ? 'طلب خطة تموين مخصصة' : 'Request Restock Plan';
    const altHref = isArabic ? 'quote-ar.html' : 'quote.html';

    conciergeContainer.innerHTML = `
        <button class="concierge-trigger" aria-label="Open B2B Support">
            <span class="pulse-ring"></span>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="badge-online"></span>
        </button>
        
        <div class="concierge-panel">
            <div class="concierge-panel-header">
                <div class="concierge-profile">
                    <div class="concierge-avatar">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <div class="concierge-info">
                        <h4>${title}</h4>
                        <span class="status-text"><span class="status-dot"></span> ${status}</span>
                    </div>
                </div>
                <button class="concierge-close" aria-label="Close">&times;</button>
            </div>
            <div class="concierge-panel-body">
                <p class="concierge-welcome">${welcome}</p>
                <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="concierge-wa-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    ${waBtnText}
                </a>
                <a href="${altHref}" class="concierge-alt-btn">
                    ${altBtnText}
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(conciergeContainer);
    
    const trigger = conciergeContainer.querySelector('.concierge-trigger');
    const panel = conciergeContainer.querySelector('.concierge-panel');
    const closeBtn = conciergeContainer.querySelector('.concierge-close');
    
    trigger.addEventListener('click', () => {
        panel.classList.toggle('active');
        trigger.classList.toggle('panel-open');
    });
    
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
        trigger.classList.remove('panel-open');
    });

    // --- B2B Workspace Consumption Simulator Logic ---
    const runSimBtn = document.getElementById('runSimBtn');
    const simForm = document.querySelector('.audit-sim-form');
    const simLoading = document.querySelector('.audit-sim-loading');
    const simResult = document.querySelector('.audit-sim-result');
    const simStatusText = document.getElementById('simStatusText');

    if (runSimBtn && simForm && simLoading && simResult) {
        runSimBtn.addEventListener('click', () => {
            const workspaceType = document.getElementById('simWorkspaceType').value;
            const headcount = parseInt(document.getElementById('simHeadcount').value) || 150;

            // Hide form and show loading
            simForm.style.display = 'none';
            simLoading.style.display = 'block';

            const statusSteps = isArabic
                ? [
                    'فحص أعداد الموظفين وتقدير متطلبات الضيافة...',
                    'حساب معدلات طباعة المستندات أسبوعياً...',
                    'تقييم هوامش الأمان والمخزون الاحتياطي بمصر...',
                    'توليد تقرير التوريد النهائي...'
                  ]
                : [
                    'Analyzing employee headcount and pantry usage...',
                    'Calculating weekly document printing rates...',
                    'Evaluating safety buffer stocks in Egypt...',
                    'Generating customized B2B replenishment plan...'
                  ];

            let stepIdx = 0;
            simStatusText.textContent = statusSteps[0];
            
            const statusInterval = setInterval(() => {
                stepIdx++;
                if (stepIdx < statusSteps.length) {
                    simStatusText.textContent = statusSteps[stepIdx];
                }
            }, 600);

            setTimeout(() => {
                clearInterval(statusInterval);
                
                // Calculate metrics based on inputs
                let coffeeVal = 0;
                let paperVal = 0;
                let tonerVal = 0;
                let freqVal = '';

                if (workspaceType === 'tech') {
                    coffeeVal = Math.round(headcount * 0.12 * 10) / 10;
                    paperVal = Math.round(headcount * 0.04);
                    tonerVal = Math.max(1, Math.round(headcount * 0.015));
                    freqVal = isArabic ? 'كل أسبوعين' : 'Bi-weekly';
                } else if (workspaceType === 'finance') {
                    coffeeVal = Math.round(headcount * 0.08 * 10) / 10;
                    paperVal = Math.round(headcount * 0.09);
                    tonerVal = Math.max(1, Math.round(headcount * 0.03));
                    freqVal = isArabic ? 'أسبوعياً' : 'Weekly';
                } else {
                    coffeeVal = Math.round(headcount * 0.1 * 10) / 10;
                    paperVal = Math.round(headcount * 0.06);
                    tonerVal = Math.max(1, Math.round(headcount * 0.02));
                    freqVal = isArabic ? 'كل أسبوعين' : 'Bi-weekly';
                }

                // Inject results
                document.getElementById('resCoffee').textContent = isArabic ? `${coffeeVal} كجم` : `${coffeeVal} kg`;
                document.getElementById('resPaper').textContent = isArabic ? `${paperVal} رزم` : `${paperVal} reams`;
                document.getElementById('resToner').textContent = isArabic ? `${tonerVal} حبارات` : `${tonerVal} cartridges`;
                document.getElementById('resFreq').textContent = freqVal;

                // Hide loading and show result
                simLoading.style.display = 'none';
                simResult.style.display = 'block';
            }, 2400);
        });
    }
    // --- Live Operations Feed Dashboard Generator ---
    const opsFeedLogs = document.getElementById('opsFeedLogs');
    const liveTimeText = document.getElementById('liveTimeText');

    if (opsFeedLogs) {
        // Update clock every second
        const updateClock = () => {
            const now = new Date();
            if (liveTimeText) {
                liveTimeText.textContent = now.toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        };
        setInterval(updateClock, 1000);
        updateClock();

        const feedTemplates = isArabic
            ? [
                { time: '04:12 ص', text: 'تم التموين: المقر الإداري للبنك التجاري الدولي CIB (فرع المعادي) - تم توريد خراطيش أحبار LaserJet وقرطاسية.' },
                { time: '03:45 ص', text: 'تم التموين: مقر فودافون مصر (التجمع الخامس) - تم شحن صندوق بوفيه الاجتماعات التنفيذي وأكواب ورقية.' },
                { time: '03:10 ص', text: 'تم التموين: مباني المجموعة المالية هيرميس (القرية الذكية) - تم استبدال حبوب قهوة إسبريسو وإعادة ملء المخزون.' },
                { time: '02:30 ص', text: 'تم التموين: مقر شركة السويدي إليكتريك (فرع التجمع) - تم توريد مستلزمات الضيافة والأوراق القياسية A4.' },
                { time: '01:50 ص', text: 'تم التموين: شركة طلعت مصطفى القابضة (وسط البلد) - إعادة تعبئة وجبات خفيفة وبن باريستا نقي.' },
                { time: '01:05 ص', text: 'تم التموين: بنك مصر للمقرات الإقليمية (سموحة، الإسكندرية) - اكتمل الفحص التلقائي وتوريد أحبار LaserJet.' },
                { time: '12:20 ص', text: 'تنبيه حركة: انطلاق 3 سيارات توصيل تابعة للأسطول اللوجستي من مستودع القاهرة المركزي.' }
              ]
            : [
                { time: '04:12 AM', text: 'Restocked: Commercial International Bank Corporate Hub (Maadi) - LaserJet toner cartridges & premium stationery supplied.' },
                { time: '03:45 AM', text: 'Restocked: Vodafone Egypt Head Office (Smart Village) - Executive boardroom pantry boxes & cups replenished.' },
                { time: '03:10 AM', text: 'Restocked: EFG Hermes Office Tower (New Cairo) - Barista espresso coffee beans restocked & verified.' },
                { time: '02:30 AM', text: 'Restocked: Elsewedy Electric HQ (Fifth Settlement) - Hospitality snacks & standard FSC-certified paper delivered.' },
                { time: '01:50 AM', text: 'Restocked: Talaat Moustafa Group Executive Suite (Downtown) - Premium breakroom provisions & custom stationery restocked.' },
                { time: '01:05 AM', text: 'Restocked: Banque Misr Regional Headquarters (Smouha, Alex) - Automated inventory check completed & toners restocked.' },
                { time: '12:20 AM', text: 'Dispatch Alert: Three B2B delivery fleet trucks dispatched from Cairo Central Warehouse.' }
              ];

        let templateIdx = 0;

        const addLog = (logObj, highlight = false) => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.style.cssText = `
                display: flex;
                gap: 12px;
                font-size: 0.82rem;
                line-height: 1.5;
                padding: 10px 14px;
                border-radius: var(--border-radius-sm);
                background: ${highlight ? 'rgba(175, 141, 76, 0.08)' : 'rgba(255, 255, 255, 0.4)'};
                border: 1px solid ${highlight ? 'var(--color-gold-border)' : 'rgba(175, 141, 76, 0.1)'};
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.5s ease-out;
                flex-direction: ${isArabic ? 'row-reverse' : 'row'};
            `;

            logItem.innerHTML = `
                <span style="font-weight: 700; color: var(--color-gold-primary); font-family: monospace; white-space: nowrap;">[${logObj.time}]</span>
                <span style="color: var(--color-text-main); font-family: ${isArabic ? 'var(--font-arabic)' : 'inherit'};">${logObj.text}</span>
            `;

            opsFeedLogs.insertBefore(logItem, opsFeedLogs.firstChild);

            // Trigger animation
            setTimeout(() => {
                logItem.style.opacity = '1';
                logItem.style.transform = 'translateY(0)';
            }, 50);

            // Remove logs beyond 5 items
            const currentLogs = opsFeedLogs.querySelectorAll('.log-item');
            if (currentLogs.length > 5) {
                const oldestLog = currentLogs[currentLogs.length - 1];
                oldestLog.style.opacity = '0';
                oldestLog.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    oldestLog.remove();
                }, 500);
            }
        };

        // Seed initial 3 logs
        for (let i = 2; i >= 0; i--) {
            addLog(feedTemplates[i], false);
        }
        templateIdx = 3;

        // Loop adding new logs
        setInterval(() => {
            addLog(feedTemplates[templateIdx], true);
            templateIdx = (templateIdx + 1) % feedTemplates.length;
        }, 4000);
    }
    // --- B2B Procurement ROI Calculator Logic ---
    const roiHoursInput = document.getElementById('roiHours');
    const roiSalaryInput = document.getElementById('roiSalary');
    const roiHoursVal = document.getElementById('roiHoursVal');
    const roiSalaryVal = document.getElementById('roiSalaryVal');
    const roiSavedTime = document.getElementById('roiSavedTime');
    const roiSavedMoney = document.getElementById('roiSavedMoney');

    if (roiHoursInput && roiSalaryInput && roiSavedTime && roiSavedMoney) {
        const updateROI = () => {
            const hours = parseInt(roiHoursInput.value) || 5;
            const salary = parseInt(roiSalaryInput.value) || 120;

            if (roiHoursVal) roiHoursVal.textContent = hours;
            if (roiSalaryVal) roiSalaryVal.textContent = salary;

            const savedHours = hours * 52;
            const savedMoney = (savedHours * salary) + 15000; // Adding baseline bulk discount / courier cost reductions

            roiSavedTime.textContent = isArabic
                ? `${savedHours.toLocaleString()} ساعة`
                : `${savedHours.toLocaleString()} Hours`;

            roiSavedMoney.textContent = isArabic
                ? `${savedMoney.toLocaleString()} جنيه`
                : `${savedMoney.toLocaleString()}`;
        };

        roiHoursInput.addEventListener('input', updateROI);
        roiSalaryInput.addEventListener('input', updateROI);

        // Initial trigger
        updateROI();
    }

    // --- Dynamic Scroll Progress Indicator ---
    const scrollProgress = document.createElement('div');
    scrollProgress.id = 'scroll-progress-bar';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gold-gradient);
        width: 0%;
        z-index: 99999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(scrollProgress);

        window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
    });

    // =========================================================================
    // --- B2B CLIENT DASHBOARD SIMULATOR ---
    // =========================================================================
    const btnEmergencyRestock = document.getElementById('btnEmergencyRestock');
    if (btnEmergencyRestock) {
        // Elements
        const fillCoffee = document.getElementById('fillCoffee');
        const fillPaper = document.getElementById('fillPaper');
        const fillInk = document.getElementById('fillInk');
        const fillSnacks = document.getElementById('fillSnacks');
        
        const valCoffee = document.getElementById('valCoffee');
        const valPaper = document.getElementById('valPaper');
        const valInk = document.getElementById('valInk');
        const valSnacks = document.getElementById('valSnacks');
        
        const logsContainer = document.getElementById('portalLogsContainer');
        const vanTracker = document.querySelector('.map-van-tracker');

        btnEmergencyRestock.addEventListener('click', () => {
            // Disable button during restock simulation
            btnEmergencyRestock.disabled = true;
            btnEmergencyRestock.textContent = isArabic ? 'جاري شحن الشحنة الطارئة...' : 'Dispatching Emergency Restock...';
            btnEmergencyRestock.style.opacity = '0.7';

            // Refill animation
            setTimeout(() => {
                if (fillCoffee) { fillCoffee.style.width = '100%'; valCoffee.textContent = '100%'; }
                if (fillPaper) { 
                    fillPaper.style.width = '100%'; 
                    fillPaper.classList.remove('low-stock');
                    valPaper.textContent = '100%';
                    valPaper.style.color = 'var(--color-text-main)';
                    const statusText = fillPaper.parentElement.nextElementSibling;
                    if (statusText) {
                        statusText.textContent = isArabic ? 'الحالة: ممتازة' : 'Status: Optimal';
                        statusText.style.color = 'var(--color-text-muted)';
                    }
                }
                if (fillInk) { fillInk.style.width = '100%'; valInk.textContent = '100%'; }
                if (fillSnacks) { fillSnacks.style.width = '100%'; valSnacks.textContent = '100%'; }
            }, 300);

            // Log entry
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            
            setTimeout(() => {
                const log1 = document.createElement('div');
                log1.textContent = isArabic 
                    ? `[${timeStr}] طوارئ: تم تقديم طلب إعادة تعبئة فوري من مدير المرافق.`
                    : `[${timeStr}] Emergency: Restock requested by facility manager.`;
                
                const log2 = document.createElement('div');
                log2.textContent = isArabic
                    ? `[${timeStr}] نظام: تمت الموافقة على الطلب التلقائي للشركات.`
                    : `[${timeStr}] System: Auto-order approved under consolidated Net-30 credit lines.`;
                
                const log3 = document.createElement('div');
                log3.textContent = isArabic
                    ? `[${timeStr}] شحن: انطلقت شاحنة أسطول التوريد #07 فوراً من مركز القرية الذكية.`
                    : `[${timeStr}] Dispatch: Fleet Van #07 dispatched immediately from Smart Village Hub.`;

                logsContainer.insertBefore(log3, logsContainer.firstChild);
                logsContainer.insertBefore(log2, logsContainer.firstChild);
                logsContainer.insertBefore(log1, logsContainer.firstChild);

                // Speed up van animation slightly to show movement
                if (vanTracker) {
                    vanTracker.style.animationDuration = '4s';
                }

                alert(isArabic 
                    ? 'تمت الموافقة الفورية على طلب التموين الطارئ! تم إرسال شاحنة الدعم رقم 07 من مستودع رويال سابلايز بالقرية الذكية. الوقت المقدر للوصول: 45 دقيقة.' 
                    : 'Emergency restocking approved! Supply Fleet Van #07 dispatched immediately from Smart Village Hub. ETA: 45 minutes.');

                btnEmergencyRestock.textContent = isArabic ? 'تم شحن التموين بنجاح' : 'Restock Dispatched';
                btnEmergencyRestock.style.background = 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)';
                btnEmergencyRestock.style.borderColor = '#1b5e20';
            }, 1000);
        });
    }

    // =========================================================================
    // --- MULTI-STEP B2B ONBOARDING WIZARD ---
    // =========================================================================
    const wizardForm = document.getElementById('corporateQuoteForm');
    const stepProgressNodes = document.querySelectorAll('.wizard-step-node');
    const wizardProgressBar = document.getElementById('wizardProgressBar');

    if (wizardForm && stepProgressNodes.length > 0) {
        let currentStep = 1;
        const totalSteps = 4;

        const btnPrev = document.getElementById('btnWizardPrev');
        const btnNext = document.getElementById('btnWizardNext');
        const btnSubmit = document.getElementById('submitFormBtn');

        // Checkbox Cards Selection
        const checkCards = document.querySelectorAll('.wizard-check-card');
        checkCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent double trigger if clicking checkbox directly
                if (e.target.type === 'checkbox') return;
                
                const chk = card.querySelector('input[type="checkbox"]');
                if (chk) {
                    chk.checked = !chk.checked;
                    card.classList.toggle('checked', chk.checked);
                    
                    // Trigger dynamic quote calculation if the handler is defined
                    if (typeof updateCalculator === 'function') {
                        updateCalculator();
                    }
                }
            });

            // If checkbox inside clicked directly, toggle card checked status
            const chk = card.querySelector('input[type="checkbox"]');
            if (chk) {
                chk.addEventListener('change', () => {
                    card.classList.toggle('checked', chk.checked);
                    if (typeof updateCalculator === 'function') {
                        updateCalculator();
                    }
                });
            }
        });

        // Validate current step inputs
        const validateStep = (step) => {
            if (step === 1) {
                const fields = [
                    document.getElementById('companyName'),
                    document.getElementById('contactPerson'),
                    document.getElementById('corporateEmail'),
                    document.getElementById('phoneNumber')
                ];
                let isValid = true;
                fields.forEach(field => {
                    if (field && !field.checkValidity()) {
                        field.reportValidity();
                        isValid = false;
                    }
                });
                return isValid;
            }
            return true; // Step 2 (ranges/dropdowns) and Step 3 (checkboxes) are always valid
        };

        // Populate step 4 review summary
        const populateSummary = () => {
            const summaryList = document.getElementById('wizardSummaryList');
            if (!summaryList) return;

            const company = document.getElementById('companyName').value || '-';
            const contact = document.getElementById('contactPerson').value || '-';
            const email = document.getElementById('corporateEmail').value || '-';
            const phone = document.getElementById('phoneNumber').value || '-';
            const headcount = document.getElementById('employeeCount').value || '150';
            
            const freqSelect = document.getElementById('restockFrequency');
            const frequency = freqSelect ? freqSelect.options[freqSelect.selectedIndex].text : '-';

            // Selected Categories list
            const selectedCategories = [];
            document.querySelectorAll('input[name="categories[]"]:checked').forEach(chk => {
                const labelText = chk.closest('.wizard-check-card').querySelector('h5').textContent;
                selectedCategories.push(labelText);
            });

            summaryList.innerHTML = isArabic
                ? `
                    <li><strong>الشركة:</strong> ${company}</li>
                    <li><strong>الشخص المسؤول:</strong> ${contact} (${email} | ${phone})</li>
                    <li><strong>حجم الموظفين:</strong> ${headcount} موظف</li>
                    <li><strong>جدولة التوريد:</strong> ${frequency}</li>
                    <li><strong>الأقسام المشمولة بالخطة:</strong> ${selectedCategories.join('، ') || 'لا توجد فئات محددة'}</li>
                  `
                : `
                    <li><strong>Company Name:</strong> ${company}</li>
                    <li><strong>Contact:</strong> ${contact} (${email} | ${phone})</li>
                    <li><strong>Average Headcount:</strong> ${headcount} Employees</li>
                    <li><strong>Frequency Preference:</strong> ${frequency}</li>
                    <li><strong>Restocking Scope:</strong> ${selectedCategories.join(', ') || 'None selected'}</li>
                  `;
        };

        // Navigation update
        const updateWizardUI = () => {
            // Show/Hide step sections
            document.querySelectorAll('.wizard-step').forEach(stepDiv => {
                stepDiv.classList.remove('active');
            });
            const activeStepDiv = document.getElementById('step' + currentStep);
            if (activeStepDiv) activeStepDiv.classList.add('active');

            // Update Progress Nodes
            stepProgressNodes.forEach(node => {
                const stepNum = parseInt(node.getAttribute('data-step'));
                node.classList.remove('active', 'completed');
                if (stepNum === currentStep) {
                    node.classList.add('active');
                } else if (stepNum < currentStep) {
                    node.classList.add('completed');
                }
            });

            // Update Progress Bar Line Width
            const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;
            if (wizardProgressBar) {
                wizardProgressBar.style.width = progressPct + '%';
            }

            // Button visibility
            if (currentStep === 1) {
                if (btnPrev) btnPrev.style.display = 'none';
                if (btnNext) btnNext.style.display = 'block';
                if (btnSubmit) btnSubmit.style.display = 'none';
            } else if (currentStep > 1 && currentStep < totalSteps) {
                if (btnPrev) btnPrev.style.display = 'block';
                if (btnNext) btnNext.style.display = 'block';
                if (btnSubmit) btnSubmit.style.display = 'none';
            } else if (currentStep === totalSteps) {
                if (btnPrev) btnPrev.style.display = 'block';
                if (btnNext) btnNext.style.display = 'none';
                if (btnSubmit) btnSubmit.style.display = 'block';
                populateSummary();
            }
        };

        // Next Button Click
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateWizardUI();
                    // Scroll to top of form smoothly
                    wizardForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // Prev Button Click
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                currentStep--;
                updateWizardUI();
                wizardForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        // Handle direct submit redirection to Portal
        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save data to localStorage
            const formData = new FormData(wizardForm);
            const data = Object.fromEntries(formData);
            data.type = 'B2B RFQ (Wizard)';
            data.timestamp = new Date().toLocaleString();
            data.id = 'SUB-' + Date.now();
            data.status = 'Pending';
            
            const submissions = JSON.parse(localStorage.getItem('royal_submissions')) || [];
            submissions.push(data);
            localStorage.setItem('royal_submissions', JSON.stringify(submissions));

            // Custom high-end submission loader
            btnSubmit.disabled = true;
            btnSubmit.textContent = isArabic ? 'جاري إعداد حساب الشركة...' : 'Configuring Corporate Account...';
            btnSubmit.style.opacity = '0.7';

            setTimeout(() => {
                alert(isArabic 
                    ? 'تم إرسال طلب التموين الموحد بنجاح! جاري تحويلك الآن لمعاينة لوحة التحكم المخصصة لشركتك.' 
                    : 'Restocking application submitted successfully! Redirecting you to your simulated Client Command Center.');
                
                // Redirect to dashboard preview
                window.location.href = isArabic ? 'dashboard-preview-ar.html' : 'dashboard-preview.html';
            }, 1500);
        });
    }
});



// --- B2B Procurement ROI Calculator Engine ---
function initROICalculator() {
    const slider = document.getElementById('roiHeadcountSlider');
    const headcountBadge = document.getElementById('roiHeadcountBadge');
    const savingsVal = document.getElementById('roiSavingsVal');
    const hoursVal = document.getElementById('roiHoursVal');
    const invoiceVal = document.getElementById('roiInvoiceVal');
    const packagePills = document.querySelectorAll('.package-pill');

    if (!slider || !savingsVal) return;

    function updateCalculations() {
        const headcount = parseInt(slider.value, 10);
        if (headcountBadge) headcountBadge.textContent = headcount + ' Employees';

        let activeMultiplier = 0;
        packagePills.forEach(pill => {
            if (pill.classList.contains('active')) {
                activeMultiplier += parseFloat(pill.getAttribute('data-weight') || '1');
            }
        });
        if (activeMultiplier === 0) activeMultiplier = 1;

        // B2B Benchmark calculations for Egypt enterprises
        const annualSavingsEGP = Math.round(headcount * 950 * activeMultiplier);
        const annualHoursSaved = Math.round((headcount / 10) * 16 * (activeMultiplier * 0.7));
        const invoicesSaved = Math.round((headcount / 20) * 12);

        // Format numbers
        const isRtl = document.documentElement.dir === 'rtl';
        const formattedSavings = isRtl
            ? (annualSavingsEGP / 1000).toFixed(0) + ' ألف ج.م / سنوياً'
            : 'EGP ' + annualSavingsEGP.toLocaleString() + ' / yr';

        const formattedHours = isRtl
            ? annualHoursSaved + ' ساعة إدارية'
            : annualHoursSaved + ' Admin Hrs / yr';

        const formattedInvoice = isRtl
            ? 'فاتورة موحدة 1 (بدلاً من ' + invoicesSaved + ')'
            : '1 E-Invoice (vs ' + invoicesSaved + ' receipts)';

        savingsVal.textContent = formattedSavings;
        hoursVal.textContent = formattedHours;
        invoiceVal.textContent = formattedInvoice;
    }

    slider.addEventListener('input', updateCalculations);

    packagePills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('active');
            updateCalculations();
        });
    });

    updateCalculations();
}

document.addEventListener('DOMContentLoaded', initROICalculator);


// --- B2B Sample Box Modal Handler ---
function initSampleBoxModal() {
    const triggerBtn = document.getElementById('openSampleModalBtn');
    const modal = document.getElementById('sampleBoxModal');
    const closeBtn = document.getElementById('closeSampleModalBtn');
    const form = document.getElementById('sampleBoxForm');

    if (!triggerBtn || !modal) return;

    triggerBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const company = document.getElementById('sampleCompany')?.value || 'Enterprise Client';
            const address = document.getElementById('sampleAddress')?.value || 'Cairo Office';

            const refId = 'ROYAL-SAMPLE-' + Math.floor(1000 + Math.random() * 9000);
            
            const isRtl = document.documentElement.dir === 'rtl';
            const msg = isRtl 
                ? 'تم تسجيل طلب عينة التموين المجانية بنجاح! رقم المتابعة: ' + refId + '\nسيصل فريق التوريد لمقر شركتكم خلال 24 ساعة.'
                : 'Corporate Sample Box Request Confirmed! Ref: ' + refId + '\nOur concierge team will deliver your trial package within 24 hours.';

            alert(msg);
            modal.classList.remove('active');
            form.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', initSampleBoxModal);


// --- B2B Dashboard Multi-Branch & Export Handler ---
function initDashboardBranchSimulator() {
    const branchPills = document.querySelectorAll('.branch-pill');
    const branchNameHeading = document.getElementById('dashBranchHeading');
    const exportBtn = document.getElementById('dashExportBtn');

    if (!branchPills.length) return;

    const branchData = {
        'hq': {
            nameEn: 'Smart Village HQ Branch',
            nameAr: 'مقر القرية الذكية (الفرع الرئيسي)',
            coffeePct: 85,
            paperPct: 92,
            tonerPct: 64,
            snackPct: 78,
            dept1: 45,
            dept2: 30,
            dept3: 25
        },
        'maadi': {
            nameEn: 'Maadi Tech Hub Branch',
            nameAr: 'فرع التكنولوجيا بالمعادي',
            coffeePct: 22,
            paperPct: 55,
            tonerPct: 30,
            snackPct: 18,
            dept1: 55,
            dept2: 25,
            dept3: 20
        },
        'alex': {
            nameEn: 'Alexandria Logistics Hub',
            nameAr: 'مقر الإسكندرية اللوجستي',
            coffeePct: 90,
            paperPct: 80,
            tonerPct: 75,
            snackPct: 60,
            dept1: 35,
            dept2: 40,
            dept3: 25
        }
    };

    branchPills.forEach(pill => {
        pill.addEventListener('click', () => {
            branchPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const code = pill.getAttribute('data-branch') || 'hq';
            const data = branchData[code] || branchData['hq'];

            const isRtl = document.documentElement.dir === 'rtl';
            if (branchNameHeading) {
                branchNameHeading.textContent = isRtl ? data.nameAr : data.nameEn;
            }

            // Update gauges
            const coffeeVal = document.getElementById('gaugeValCoffee');
            const paperVal = document.getElementById('gaugeValPaper');
            const tonerVal = document.getElementById('gaugeValToner');
            const snackVal = document.getElementById('gaugeValSnack');

            if (coffeeVal) coffeeVal.textContent = data.coffeePct + '%';
            if (paperVal) paperVal.textContent = data.paperPct + '%';
            if (tonerVal) tonerVal.textContent = data.tonerPct + '%';
            if (snackVal) snackVal.textContent = data.snackPct + '%';

            // Update Department Fill Bars
            const fill1 = document.getElementById('deptFill1');
            const fill2 = document.getElementById('deptFill2');
            const fill3 = document.getElementById('deptFill3');

            if (fill1) fill1.style.width = data.dept1 + '%';
            if (fill2) fill2.style.width = data.dept2 + '%';
            if (fill3) fill3.style.width = data.dept3 + '%';
        });
    });

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

document.addEventListener('DOMContentLoaded', initDashboardBranchSimulator);


// --- Accessibility & Keyboard Event Handling ---
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const searchOverlay = document.querySelector('.search-overlay.active');
        if (searchOverlay) searchOverlay.classList.remove('active');

        const sampleModal = document.querySelector('.sample-modal-backdrop.active');
        if (sampleModal) sampleModal.classList.remove('active');

        const navLinks = document.querySelector('.nav-links.active');
        if (navLinks) {
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});
