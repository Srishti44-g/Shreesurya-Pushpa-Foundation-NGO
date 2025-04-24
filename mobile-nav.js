document.addEventListener('DOMContentLoaded', () => { 
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const menuLinks = document.querySelectorAll('.mobile-nav-menu a'); // nav links inside menu

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNavMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNavMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Add scroll handling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 50) {
            mobileNav.classList.add('scrolled');
        } else {
            mobileNav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
});
