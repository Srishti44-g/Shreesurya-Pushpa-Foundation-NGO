document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', 
            hamburger.classList.contains('active'));
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger?.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            closeMenu();
        }
    });
});

// Navigation elements
const navOverlay = document.querySelector('.nav-overlay');
const nav = document.querySelector('.main-nav');
const sections = document.querySelectorAll('section[id]');

// Add shadow to nav on scroll
window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 0 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
});

// Navigation scroll handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = document.querySelector('.top-header').offsetHeight + 
                               document.querySelector('.main-nav').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced navbar behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.top-header');
    const headerHeight = header.offsetHeight;
    
    // Ensure nav stays below header
    if (currentScroll > headerHeight) {
        if (currentScroll > lastScroll) {
            nav.style.transform = `translateY(${headerHeight}px)`;
            nav.style.position = 'fixed';
            nav.style.top = '0';
        } else {
            nav.style.transform = `translateY(${headerHeight}px)`;
            nav.style.position = 'fixed';
            nav.style.top = '0';
        }
    } else {
        nav.style.transform = 'translateY(0)';
        nav.style.position = 'fixed';
        nav.style.top = `${headerHeight}px`;
    }
    lastScroll = currentScroll;
});

// Active link highlight on scroll
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const headerOffset = document.querySelector('.top-header').offsetHeight + 
                        document.querySelector('.main-nav').offsetHeight;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerOffset - 10;
        const sectionId = section.getAttribute('id');
        
        // Modify selector to exclude donate button
        const link = document.querySelector(`.nav-links a[href*="${sectionId}"]:not(.donate-btn)`);
        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all links except donate button
                document.querySelectorAll('.nav-links a:not(.donate-btn)').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// Add specific handling for donate button
document.addEventListener('DOMContentLoaded', () => {
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn && window.location.pathname.includes('donate.html')) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        donateBtn.classList.add('active');
    }
});

// Generic form handler for all forms
function initializeFormHandler(formConfig) {
    const { formId, successMessage, submittingText } = formConfig;
    const formElement = document.querySelector(`#${formId}`);

    if (!formElement) return;

    function resetFormCompletely(form) {
        // Reset the form fields
        form.reset();
        
        // Clear any validation states
        form.querySelectorAll('.is-valid, .is-invalid').forEach(element => {
            element.classList.remove('is-valid', 'is-invalid');
        });
        
        // Reset any custom input states
        form.querySelectorAll('input, textarea').forEach(element => {
            element.value = '';
            element.style.borderColor = '';
            element.nextElementSibling?.classList.remove('active');
        });
        
        // Reset select elements to default
        form.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Clear any error messages
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const status = form.querySelector('#formStatus') || createStatusElement(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerText;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner"></span> ${submittingText || 'Submitting...'}`;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            });
            
            const result = await response.text();
            
            // Handle Google Apps Script response
            if (result.includes('success')) {
                // Success feedback
                status.className = 'form-status success';
                status.innerHTML = `<i class="fas fa-check-circle"></i> ${successMessage}`;
                resetFormCompletely(form);
            } else {
                // Error feedback
                status.className = 'form-status error';
                status.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${result || 'Submission failed. Please try again.'}`;
            }

            // Animate status message
            status.style.opacity = '1';
            status.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                status.style.opacity = '0';
                status.style.transform = 'translateY(-10px)';
            }, 5000);

        } catch (error) {
            console.error(`${formId} submission error:`, error);
            status.className = 'form-status error';
            status.innerHTML = `<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.`;
        } finally {
            submitButton.disabled = false;
            submitButton.innerText = originalText;
            status.style.display = 'block';
        }
    });
}

// Initialize all forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const forms = [
        {
            formId: 'contactForm',
            successMessage: 'Thank you for contacting us! We have received your message and will respond within 24-48 hours. For urgent matters, please call our helpline.',
            errorMessage: 'Unable to send message. Please check your connection and try again.',
            submittingText: 'Sending your message...',
            validationMessage: 'Please ensure all fields are filled correctly.'
        },
        {
            formId: 'volunteerForm',
            successMessage: 'Thank you for your interest in volunteering! Your application has been received. Our team will review it and contact you within 3-5 business days to discuss the next steps.',
            errorMessage: 'Unable to submit volunteer application. Please try again or email us directly.',
            submittingText: 'Submitting your application...',
            validationMessage: 'Please complete all required fields in the volunteer form.'
        },
        {
            formId: 'donateForm',
            successMessage: 'Thank you for your generous donation! A confirmation email has been sent to your registered email address. Your support makes a real difference in our community.',
            errorMessage: 'Transaction could not be completed. Please verify your details and try again.',
            submittingText: 'Processing your donation...',
            validationMessage: 'Please ensure all payment details are entered correctly.'
        }
    ];

    forms.forEach(formConfig => {
        const form = document.getElementById(formConfig.formId);
        if (form) {
            // Add validation before submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const status = form.querySelector('.form-status') || createStatusElement(form);
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.innerText;

                // Validate form
                if (!validateForm(form)) {
                    status.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${formConfig.validationMessage}`;
                    status.className = 'form-status warning';
                    showStatus(status);
                    return;
                }

                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = `<span class="spinner"></span> ${formConfig.submittingText}`;
                
                try {
                    // Simulate form submission (replace with actual API call)
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Success feedback
                    status.className = 'form-status success';
                    status.innerHTML = `<i class="fas fa-check-circle"></i> ${formConfig.successMessage}`;
                    resetForm(form);
                } catch (error) {
                    status.className = 'form-status error';
                    status.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${formConfig.errorMessage}`;
                } finally {
                    submitButton.disabled = false;
                    submitButton.innerText = originalText;
                    showStatus(status);
                }
            });
        }
    });
});

function createStatusElement(form) {
    const status = document.createElement('div');
    status.className = 'form-status';
    form.appendChild(status);
    return status;
}

function showStatus(status) {
    status.style.display = 'block';
    status.style.opacity = '1';
    status.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        status.style.opacity = '0';
        status.style.transform = 'translateY(-10px)';
    }, 5000);
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    return isValid;
}

function resetForm(form) {
    form.reset();
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

// Custom translation mapping
const customTranslations = {
    en: {
        'foundation_name': 'Shreesurya Pushpa Foundation',
        'foundation_name_full': 'Shreesurya Pushpa Foundation - For Better Future',
        'foundation_name_variations': [
            'Shreesurya Pushpa Foundation',
            'Shreesurya Pushpa Foundation',
            'Shreesurya Pushpa Foundation',
            'Shreesurya Pushpa Foundation'
        ]
    },
    hi: {
        'foundation_name': 'श्रीसूर्या पुष्पा फाउंडेशन',
        'foundation_name_full': 'श्रीसूर्या पुष्पा फाउंडेशन - एक बेहतर भविष्य के लिए',
        'foundation_name_variations': [
            'श्रीसूर्या पुष्पा फाउंडेशन',
            'श्रीसूर्या पुष्पा फाउंडेशन',
            'श्रीसूर्या पुष्पा फाउंडेशन'
        ]
    }
};

// Function to handle custom translations
function updateCustomTranslations(langCode) {
    const translations = customTranslations[langCode];
    if (!translations) return;

    // Function to replace text in an element
    function replaceText(element) {
        if (!element || !element.textContent) return;
        
        // Replace variations with correct name
        let text = element.textContent;
        const variations = customTranslations.en.foundation_name_variations;
        variations.forEach(variant => {
            text = text.replace(new RegExp(variant, 'gi'), translations.foundation_name);
        });
        
        // Update text if changed
        if (text !== element.textContent) {
            element.textContent = text;
        }
    }

    // Update foundation name in logo
    const logoText = document.querySelector('.logo-text h1');
    if (logoText) {
        logoText.textContent = translations.foundation_name;
    }

    // Update data-translate elements
    document.querySelectorAll('[data-translate="foundation_name"]').forEach(element => {
        element.textContent = translations.foundation_name;
    });
    
    document.querySelectorAll('[data-translate="foundation_name_full"]').forEach(element => {
        element.textContent = translations.foundation_name_full;
    });

    // Scan all text nodes for variations and replace
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        const parent = node.parentElement;
        // Skip if parent has data-translate or is a script/style
        if (parent.hasAttribute('data-translate') || 
            parent.tagName === 'SCRIPT' || 
            parent.tagName === 'STYLE') {
            continue;
        }
        replaceText(node);
    }
}

// Language switching functionality
function changeLanguage(langCode) {
    // Clear existing translation cookies
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;domain=${window.location.hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;

    if (langCode === 'en') {
        // Remove translation and reload for English
        localStorage.removeItem('preferred_language');
        location.reload();
        return;
    } else if (langCode === 'hi') {
        // Set Hindi translation
        document.cookie = `googtrans=/en/hi`;
        document.cookie = `googtrans=/en/hi;domain=.${window.location.hostname}`;
    }

    // Apply custom translations before Google Translate
    updateCustomTranslations(langCode);

    // Force refresh translation
    try {
        const googleFrame = document.getElementsByClassName('goog-te-menu-frame')[0];
        if (googleFrame) {
            const comboBox = googleFrame.contentWindow.document.getElementsByClassName('goog-te-combo')[0];
            comboBox.value = langCode;
            comboBox.dispatchEvent(new Event('change'));
        } else {
            // Reinitialize translator if frame not found
            const elem = document.getElementById('google_translate_element');
            elem.innerHTML = '';
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                autoDisplay: false
            }, 'google_translate_element');
        }
    } catch (e) {
        console.warn('Translation refresh failed:', e);
        location.reload();
    }

    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === langCode);
    });

    // Save preference only for Hindi
    if (langCode === 'hi') {
        localStorage.setItem('preferred_language', langCode);
    }
}

// Apply saved language preference with retry mechanism
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && savedLang !== 'en') {
        let attempts = 0;
        const maxAttempts = 3;
        
        const tryApplyLanguage = () => {
            if (attempts >= maxAttempts) return;
            
            try {
                changeLanguage(savedLang);
            } catch (e) {
                attempts++;
                setTimeout(tryApplyLanguage, 1000);
            }
        };

        setTimeout(tryApplyLanguage, 1000);
    }
});

// Error handling
window.addEventListener('error', function (e) {
    if (e.filename && e.filename.includes('translate')) {
        console.error('Translation error:', e);
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.style.opacity = '0.5';
            btn.disabled = true;
        });
    }
});
