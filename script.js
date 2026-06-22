document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference, otherwise default to light theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#ffbd2e'; // Amber glow for sun
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = 'var(--text-primary)';
        }
    }

    /* ==========================================================================
       TYPING EFFECT (HERO)
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const roles = ['an ECE Student'];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newRoleDelay = 2000; // Delay between roles
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (roles.length > 1) {
            setTimeout(erase, newRoleDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start type effect
    if (roles.length) setTimeout(type, 1000);

    /* ==========================================================================
       MOBILE MENU DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop scrolling behind drawer
    });

    const closeMobileMenu = () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
    };

    mobileCloseBtn.addEventListener('click', closeMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu if clicked outside the contents
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && 
            !mobileDrawer.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       ACTIVE NAV LINK ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger Skill bar fill animation specifically when Skills section is revealed
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(element => {
        revealObserver.observe(element);
    });

    function animateSkillBars() {
        const fills = document.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    /* ==========================================================================
       INTERACTIVE SKILLS TABS SWITCH
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'technical') {
                animateSkillBars();
            }
        });
    });

    /* ==========================================================================
       MODAL POPUPS FOR PROJECTS & CERTIFICATES
       ========================================================================== */
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalDetailsContainer = document.getElementById('modal-project-details');
    const openProjectButtons = document.querySelectorAll('.open-project-btn');

    // Case Study Mock Data
    const projectCaseStudies = {
        'crop-iq': {
            title: 'Crop IQ — Smart Agriculture Monitor',
            category: 'Artificial Intelligence + Agri-Tech',
            duration: '4 Months',
            role: 'Lead System Architect',
            desc: `
                <div class="modal-project-body">
                    <p>Crop IQ is an intelligent agriculture application designed to monitor crop conditions, analyze weather data, and provide crop recommendations based on location and environmental factors.</p>
                    
                    <h4>Technical Architecture</h4>
                    <p>The system utilizes IoT sensor nodes deployed across fields to measure soil moisture, temperature, and humidity. These metrics are transmitted to a central gateway and processed using machine learning models to identify crop health anomalies, forecast irrigation requirements, and predict yield expectations.</p>
                    
                    <h4>Key Features</h4>
                    <ul>
                        <li><strong>Real-time Field Monitoring:</strong> Constant data streaming of critical environmental variables to a unified dashboard.</li>
                        <li><strong>ML-Powered Recommendations:</strong> Accurate crop suggestions and fertilizer recommendations based on localized soil and climate data.</li>
                        <li><strong>Weather Integration:</strong> Automatic correlation with external weather APIs to optimize watering schedules and predict rainfall events.</li>
                    </ul>

                    <h4>Hardware & Software Stack</h4>
                    <p>Python, TensorFlow/Keras, IoT Sensor Networks, Live Data Streaming, REST APIs, Custom Dashboard UI.</p>
                </div>
            `
        }
    };

    // Certificate Mock Modal / Link Behavior
    const certMockData = {
        'intern': {
            title: 'Internship Completion Certificates',
            issuer: 'Professional Experience',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_enthu.png')">
                            <img src="cert_enthu.png" alt="Enthu Technology Solutions Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>PCB Design & Fabrication Intern</h4>
                            <h5>Enthu Technology Solutions India Pvt Ltd</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> June 16, 2025 – July 4, 2025</p>
                            <p class="modal-cert-info">Successfully completed 3 weeks of hands-on industrial internship covering schematic entry, trace layout routing, board etching, drilling, and electronic component assembly.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_enthu.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 2 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_edutantr.png')">
                            <img src="cert_edutantr.png" alt="EDU TANTR Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>VLSI Internship Program</h4>
                            <h5>EDU TANTR</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> August 2025 – November 2025</p>
                            <p class="modal-cert-info">Participated in VLSI digital logic design, writing behavioral system descriptions using VHDL, developing testbenches, and simulating digital integrated circuit workflows.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_edutantr.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 3 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_eduskills.png')">
                            <img src="cert_eduskills.png" alt="EduSkills Microchip Certificate" class="modal-cert-thumb portrait-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Embedded System Developer Virtual Internship</h4>
                            <h5>EduSkills (Supported by Microchip)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> January 2025 – March 2025</p>
                            <p class="modal-cert-info">Successfully completed 10 weeks of virtual training program focused on embedded systems engineering, MCU programming, digital electronics interfaces, and simulator verification.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_eduskills.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'hackathon': {
            title: 'Hackathon Participation Certificates',
            issuer: 'Hackathons & Competitions',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_vibe.png')">
                            <img src="cert_vibe.png" alt="TechSprint VIBE X 1.0 Certificate of Excellence" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Top 10 Finalist - TechSprint: Vibe X 1.0</h4>
                            <h5>GDG On Campus & Paavai Engineering College</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> October 2025</p>
                            <p class="modal-cert-info">Achieved distinction as a Top 10 Finalist in a competitive hackathon out of hundreds of participants. Successfully built a high-quality product prototype using Google Technologies and qualified for the Grand Finale Pitch.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_vibe.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 2 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_innovate.png')">
                            <img src="cert_innovate.png" alt="GSA India Tech Summit Innovate 2026 Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Certificate of Participation - Innovate 2026</h4>
                            <h5>Google Student Ambassador (GSA) & India Tech Summit</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> March 10, 2026</p>
                            <p class="modal-cert-info">Verified participation in the Innovate 2026 Hackathon as part of Team "TECH BINDERS", authorized by the Google Student Ambassador Coordinator.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_innovate.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 3 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_bit_expo.png')">
                            <img src="cert_bit_expo.png" alt="BIT V-PRAYUKTI 25 Product Expo Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Certificate of Achievement - Product Expo</h4>
                            <h5>Bannari Amman Institute of Technology & BIT V-PRAYUKTI' 25</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> February 08, 2025</p>
                            <p class="modal-cert-info">Awarded Certificate of Achievement for active participation in the Product Expo competition at the National Level Technical Symposium organized by the Dept of ECE & Bio-Medical Engineering.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_bit_expo.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'course': {
            title: 'Course Completed Certificates',
            issuer: 'Online & Professional Courses',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_nptel.png')">
                            <img src="cert_nptel.png" alt="NPTEL Online Certification" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Introduction To Internet Of Things (Elite)</h4>
                            <h5>Indian Institute of Technology Kharagpur & NPTEL</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> Jan - Apr 2025 (12 Weeks)</p>
                            <p class="modal-cert-info">Successfully completed the 12-week national course with a consolidated score of 82% (Elite certificate). Covered core concepts of IoT protocols, sensors, actuators, and network routing.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_nptel.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 2 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_matlab.png')">
                            <img src="cert_matlab.png" alt="MathWorks MATLAB Onramp Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>MATLAB Onramp</h4>
                            <h5>MathWorks Training Services</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> October 23, 2025</p>
                            <p class="modal-cert-info">Successfully completed 100% of the self-paced training course, covering core MATLAB commands, calculation arrays, matrix calculations, data visualization, and scripting.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_matlab.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 3 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_ibm_ai.png')">
                            <img src="cert_ibm_ai.png" alt="IBM SkillsBuild AI Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Getting Started with Artificial Intelligence</h4>
                            <h5>IBM SkillsBuild</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> Issued on: February 07, 2026</p>
                            <p class="modal-cert-info">Recognized commitment to achieve professional excellence by completing requirements for artificial intelligence fundamentals, machine learning models, and ethical AI deployment.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_ibm_ai.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'competition': {
            title: 'Academic & Technical Competitions',
            issuer: 'Academic & Technical Competitions',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_isro_wsw.jpg')">
                            <img src="cert_isro_wsw.jpg" alt="ISRO World Space Week Project Explanation" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>ISRO Project Explanation Competition</h4>
                            <h5>Satish Dhawan Space Centre SHAR, ISRO Sriharikota</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> October 4 – 10, 2025</p>
                            <p class="modal-cert-info">Participated and demonstrated electronic project layouts during the World Space Week 2025 (Theme: Living in Space) Celebrations organized by Satish Dhawan Space Centre SHAR, ISRO.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_isro_wsw.jpg')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 2 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_isro_souvenir.png')">
                            <img src="cert_isro_souvenir.png" alt="Official ISRO Rocket Launch Souvenir" class="modal-cert-thumb portrait-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Official ISRO Rocket Launch Souvenir Memento</h4>
                            <h5>Satish Dhawan Space Centre SHAR, ISRO Sriharikota</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-gift"></i> October 2025</p>
                            <p class="modal-cert-info">Awarded an official framed rocket launch memento with best compliments from the Director of Satish Dhawan Space Centre SHAR, ISRO, for excellence in project presentation.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_isro_souvenir.png')">
                                <i class="fa-solid fa-eye"></i> View Souvenir
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 3 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_hindusthan_paper.png')">
                            <img src="cert_hindusthan_paper.png" alt="National Level Paper Presentation Certificate" class="modal-cert-thumb portrait-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>National Level Paper Presentation</h4>
                            <h5>Hindusthan Institute of Technology (Autonomous)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> October 15, 2025</p>
                            <p class="modal-cert-info">Presented a technical research paper at the 17th National Level Technical Symposium BARNSTROMZ-2K25, organized by the Department of Electronics and Communication Engineering in association with the ISTE Student Chapter.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_hindusthan_paper.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 4 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_iste_level3.png')">
                            <img src="cert_iste_level3.png" alt="ISTE Level 3 Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Srinivasa Ramanujan Mathematical Competitions - Level 3 (National Level)</h4>
                            <h5>Indian Society for Technical Education (ISTE)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> February 21 & 22, 2026</p>
                            <p class="modal-cert-info">Participated and excelled in the Level 3 National Level mathematical competitions conducted by ISTE Tamilnadu Section during the academic year 2025-2026.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_iste_level3.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 5 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_iste_level2.png')">
                            <img src="cert_iste_level2.png" alt="ISTE Level 2 Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Srinivasa Ramanujan Mathematical Competitions - Level 2 (State Level)</h4>
                            <h5>Indian Society for Technical Education (ISTE)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> February 14 & 15, 2026</p>
                            <p class="modal-cert-info">Participated and qualified in the Level 2 State Level competitions conducted by ISTE Tamilnadu Section during the academic year 2025-2026.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_iste_level2.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 6 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_iste_level1.jpg')">
                            <img src="cert_iste_level1.jpg" alt="ISTE Level 1 Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Srinivasa Ramanujan Mathematical Competitions - Level 1 (Chapter Level)</h4>
                            <h5>Indian Society for Technical Education (ISTE)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> January 24 & 25, 2026</p>
                            <p class="modal-cert-info">Participated and qualified in the Level 1 Chapter Level competitions conducted by ISTE Tamilnadu Section during the academic year 2025-2026.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_iste_level1.jpg')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'bootcamp': {
            title: 'Bootcamps & Idea Development',
            issuer: 'Ignite Bootcamp & Venture Prototyping',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_wadhwani.png')">
                            <img src="cert_wadhwani.png" alt="Wadhwani Foundation Ignite Bootcamp Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Ignite Bootcamp - Venture Idea Development</h4>
                            <h5>Wadhwani Global Entrepreneur & Wadhwani Foundation</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> Completed on: March 10, 2026</p>
                            <p class="modal-cert-info">Successfully participated in the 10-hour Ignite Bootcamp, gaining essential skills in business ideation, product prototyping, business model canvas formulation, and venture financial planning.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_wadhwani.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'professional': {
            title: 'Professional IT & Networking',
            issuer: 'Professional Technical Credentials',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_juniper_jncia.png')">
                            <img src="cert_juniper_jncia.png" alt="Juniper JNCIA-Junos Certificate" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>JNCAA - Junos, Associate (JNCIA-Junos)</h4>
                            <h5>Juniper Networks | Education Services</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> Saturday, April 12, 2025</p>
                            <p class="modal-cert-info">Vendor-specific technical certification validating core competency in Juniper Networks Junos OS, networking fundamentals, routing essentials, and routing policies.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_juniper_jncia.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        'workshop': {
            title: 'Technical Workshops & Seminars',
            issuer: 'Workshops, Seminars & Symposia',
            desc: `
                <div class="modal-certificates-list">
                    <!-- Certificate 1 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_nielit_embedded.png')">
                            <img src="cert_nielit_embedded.png" alt="Progressive Innovations in Embedded Computing through AI" class="modal-cert-thumb portrait-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Progressive Innovations in Embedded Computing through AI</h4>
                            <h5>Indian Info Tech Research & Training Center (Affiliated to NIELIT)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> August 23, 2025</p>
                            <p class="modal-cert-info">Successfully completed the specialized training workshop on the incorporation of artificial intelligence methods in embedded systems computing models.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_nielit_embedded.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 2 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_bit_branding.png')">
                            <img src="cert_bit_branding.png" alt="Personal Branding on LinkedIn Workshop" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>Personal Branding on LinkedIn Workshop</h4>
                            <h5>Bannari Amman Institute of Technology & BIT V-PRAYUKTI' 25</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> February 08, 2025</p>
                            <p class="modal-cert-info">Completed the professional training seminar on leveraging LinkedIn algorithms, networking tools, and digital portfolio strategies for personal branding.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_bit_branding.png')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>

                    <!-- Certificate 3 -->
                    <div class="modal-cert-item glass-card">
                        <div class="modal-cert-img-wrapper" onclick="window.openLightbox('cert_kongu_iot.jpg')">
                            <img src="cert_kongu_iot.jpg" alt="Internet of Things using Raspberry-Pi Workshop" class="modal-cert-thumb">
                            <div class="modal-cert-hover-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                <span>Click to Zoom</span>
                            </div>
                        </div>
                        <div class="modal-cert-details">
                            <h4>One-day Workshop on "Internet of Things using Raspberry-Pi"</h4>
                            <h5>Kongu Engineering College (Autonomous)</h5>
                            <p class="modal-cert-date"><i class="fa-solid fa-calendar-days"></i> September 09, 2024</p>
                            <p class="modal-cert-info">Attended a hands-on technical workshop on configuring Raspberry-Pi SBCs, interfacing sensory hardware nodes, and writing IoT network controller scripts.</p>
                            <button class="btn btn-secondary btn-sm" onclick="window.openLightbox('cert_kongu_iot.jpg')">
                                <i class="fa-solid fa-eye"></i> View Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `
        }
    };

    // Open Project Modal
    openProjectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const data = projectCaseStudies[projectId];
            
            if (data) {
                modalDetailsContainer.innerHTML = `
                    <div class="modal-project-header">
                        <span class="project-category">${data.category}</span>
                        <h3 class="modal-project-title">${data.title}</h3>
                        <div class="modal-project-meta">
                            <span><i class="fa-solid fa-calendar"></i> ${data.duration}</span>
                            <span><i class="fa-solid fa-user-tag"></i> ${data.role}</span>
                        </div>
                    </div>
                    ${data.desc}
                `;
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Handle Certificate Clicks (using event delegation for original and cloned elements)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-cert-btn');
        if (btn) {
            const certId = btn.getAttribute('data-cert');
            const data = certMockData[certId];
            if (data) {
                modalDetailsContainer.innerHTML = `
                    <div class="modal-project-header">
                        <span class="project-category">${data.issuer}</span>
                        <h3 class="modal-project-title">${data.title}</h3>
                    </div>
                    ${data.desc}
                `;
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal if clicked overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const submitText = submitBtn.querySelector('span');
                const submitIcon = submitBtn.querySelector('i');
                
                // Mock submission UI state changes
                submitBtn.disabled = true;
                submitText.textContent = 'Sending Message...';
                submitIcon.className = 'fa-solid fa-circle-notch fa-spin';
                
                setTimeout(() => {
                    // Simulated success
                    showToast('Message sent! I will contact you soon.', 'success');
                    contactForm.reset();
                    
                    // Restore button state
                    submitBtn.disabled = false;
                    submitText.textContent = 'Send Message';
                    submitIcon.className = 'fa-solid fa-paper-plane';
                }, 1800);
            }
        });

        function validateForm() {
            let isValid = true;
            
            const inputs = [
                { element: document.getElementById('name'), validate: val => val.trim() !== '' },
                { element: document.getElementById('email'), validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
                { element: document.getElementById('subject'), validate: val => val.trim() !== '' },
                { element: document.getElementById('message'), validate: val => val.trim() !== '' }
            ];

            inputs.forEach(input => {
                const formGroup = input.element.closest('.form-group');
                const value = input.element.value;
                
                if (!input.validate(value)) {
                    formGroup.classList.add('invalid');
                    isValid = false;
                } else {
                    formGroup.classList.remove('invalid');
                }

                // Remove invalid class on typing
                input.element.addEventListener('input', () => {
                    if (input.validate(input.element.value)) {
                        formGroup.classList.remove('invalid');
                    }
                });
            });

            return isValid;
        }
    }

    /* ==========================================================================
       TOAST NOTIFICATIONS
       ========================================================================== */
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('.toast-icon');
        if (type === 'success') {
            icon.className = 'fa-solid fa-circle-check toast-icon';
            toast.querySelector('.toast-content').style.background = '#10b981'; // Green
        } else {
            icon.className = 'fa-solid fa-triangle-exclamation toast-icon';
            toast.querySelector('.toast-content').style.background = '#f59e0b'; // Amber/warning
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    // Add event log on resume download for verification
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            showToast('Downloading Resume...', 'success');
        });
    }

    /* ==========================================================================
       LIGHTBOX MODAL FOR CERTIFICATES
       ========================================================================== */
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close-btn');

    window.openLightbox = function(src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
        if (!modal.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    };

    lightboxClose.addEventListener('click', window.closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            window.closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            window.closeLightbox();
        }
    });

    /* ==========================================================================
       AUTOPLAY HORIZONTAL CAROUSELS (Continuous Smooth Tickers)
       ========================================================================== */
    function setupAutoScroll(containerSelector, speed = 0.05) {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            let lastTime = null;
            let animationFrameId = null;
            let isInitialized = false;
            let resetThreshold = null;

            function initInfiniteScroll() {
                const originalChildren = Array.from(container.children);
                if (originalChildren.length === 0) return;

                // Clone and append all children to make the loop seamless
                originalChildren.forEach(child => {
                    const clone = child.cloneNode(true);
                    container.appendChild(clone);
                });

                const firstElement = originalChildren[0];
                const firstClone = container.children[originalChildren.length];
                
                // The distance to scroll before wrapping back to 0
                resetThreshold = firstClone.offsetLeft - firstElement.offsetLeft;

                // Disable auto-scrolling if the content fits in the container without overflow
                if (resetThreshold <= container.clientWidth) {
                    resetThreshold = null;
                    return;
                }

                // Bind wrap-around logic on native scroll event for manual swiping too
                container.addEventListener('scroll', () => {
                    if (resetThreshold === null) return;
                    if (container.scrollLeft >= resetThreshold) {
                        container.scrollLeft -= resetThreshold;
                    } else if (container.scrollLeft < 0) {
                        container.scrollLeft += resetThreshold;
                    }
                });
            }

            function step(timestamp) {
                if (!lastTime) lastTime = timestamp;
                const elapsed = timestamp - lastTime;
                lastTime = timestamp;

                if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                    // Initialize lazily if not done yet
                    if (!isInitialized) {
                        isInitialized = true;
                        initInfiniteScroll();
                    }

                    if (resetThreshold !== null) {
                        // Scroll subpixel offset based on elapsed time for constant speed
                        container.scrollLeft += speed * elapsed;
                    }
                }

                animationFrameId = requestAnimationFrame(step);
            }

            // Start animation loop
            animationFrameId = requestAnimationFrame(step);
        });
    }

    // Initialize continuous auto scroll (pixels per millisecond, e.g., 0.04 = ~40px/s)
    setupAutoScroll('.skills-grid', 0.04);
    setupAutoScroll('.certifications-grid', 0.04);
    setupAutoScroll('.achievements-grid', 0.04);
});
