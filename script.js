document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de Iconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- LOGICA DEL PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Saltar preloader en visitas repetidas de la misma sesión
        if (sessionStorage.getItem('visited')) {
            preloader.style.display = 'none';
        } else {
            sessionStorage.setItem('visited', '1');
            window.addEventListener('load', () => {
                preloader.classList.add('opacity-0');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 700);
            });
        }
    }

    // Lógica simple para los Tabs
    window.openTab = function(tabName) {
        // 1. Ocultar todos los contenidos y actualizar ARIA
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('block');
            content.setAttribute('aria-hidden', 'true');
        });

        // 2. Desactivar todos los botones y actualizar ARIA
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-brand-accent', 'text-white');
            btn.classList.add('bg-zinc-800', 'text-zinc-400');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        // 3. Mostrar el contenido seleccionado y actualizar ARIA
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('block');
            activeContent.setAttribute('aria-hidden', 'false');
        }

        // 4. Activar el botón seleccionado y actualizar ARIA
        const activeBtn = document.querySelector(`button[data-target="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-zinc-800', 'text-zinc-400');
            activeBtn.classList.add('bg-brand-accent', 'text-white');
            activeBtn.setAttribute('aria-selected', 'true');
            activeBtn.setAttribute('tabindex', '0');
            activeBtn.focus(); // Opcional: enfocar la pestaña activa para usuarios de teclado
        }
    }

    // Lógica del Modal (Zoom)
    const modal = document.getElementById('productModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalImg = document.getElementById('modalImg');
    const modalBtn = document.getElementById('modalBtn');

    window.openModal = function(title, price, desc, img) {
        if (!modal || !backdrop || !panel || !modalTitle || !modalPrice || !modalDesc || !modalImg || !modalBtn) {
            console.error("One or more modal elements not found.");
            return;
        }

        // 1. Llenar datos
        modalTitle.innerText = title;
        modalPrice.innerText = price;
        modalDesc.innerText = desc;
        modalImg.src = img;
        
        // 2. Configurar botón de WhatsApp dinámico
        const phone = "51953214121"; // Tu número actualizado
        const text = `Hola Grit, me gustaría pedir una ${title} de ${price}`;
        modalBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

        // 3. Mostrar y Animar
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('scale-90', 'opacity-0');
            panel.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    window.closeModal = function() {
        if (!modal || !backdrop || !panel) {
            console.error("One or more modal elements not found for closing.");
            return;
        }
        backdrop.classList.add('opacity-0');
        panel.classList.remove('scale-100', 'opacity-100');
        panel.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Esperar a que termine la animación
    }

    // Lógica de Estado (Abierto/Cerrado)
    function checkStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const time = hour + minutes/60;

        // Horario: 6PM (18:00) a 11:50PM (23.83)
        // Martes (2) cerrado
        const isOpenDay = day !== 2; 
        const isOpenTime = time >= 18 && time < 23.83;

        const badge = document.getElementById('status-badge');
        if (!badge) return;

        const statusText = badge.querySelector('span:last-child');
        const statusDot = badge.querySelector('.relative.flex.h-2.w-2');

        if (isOpenDay && isOpenTime) {
            if (statusDot) statusDot.innerHTML = '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>';
            if (statusText) statusText.textContent = 'ABIERTO AHORA';
            badge.classList.replace('border-zinc-700', 'border-green-500/50');
        } else {
            if (statusDot) statusDot.innerHTML = '<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>';
            if (statusText) statusText.textContent = 'CERRADO';
            badge.classList.replace('border-green-500/50', 'border-zinc-700');
        }
    }
    checkStatus();
    setInterval(checkStatus, 60000); // Actualizar cada minuto

    // Lógica de Scroll Reveal (Aparición suave)
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
        });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback para navegadores sin IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }

    // --- EFECTO DE BRASAS (FIRE EMBERS) ---
    const embersContainer = document.getElementById('embers-container');
    function createEmber() {
        if (!embersContainer) return;
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.style.left = Math.random() * 100 + '%';
        ember.style.animationDuration = (Math.random() * 3 + 2) + 's'; 
        ember.style.opacity = Math.random();
        
        embersContainer.appendChild(ember);
        setTimeout(() => { ember.remove(); }, 5000);
    }
    if (embersContainer) {
        setInterval(createEmber, 150);
    }

    // Accesibilidad: permitir activar los elementos con role=button desde teclado
    document.querySelectorAll('[role="button"]').forEach(el => {
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

    // --- NAVEGACIÓN INTELIGENTE (Auto-hide on scroll) ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    const announcementBar = document.querySelector('.bg-brand-promo');
    const announcementBarHeight = announcementBar ? announcementBar.offsetHeight : 0;

    if (navbar) {
        window.addEventListener("scroll", function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > (announcementBarHeight + 50)) { 
                navbar.classList.add('-translate-y-full');
            } else {
                navbar.classList.remove('-translate-y-full');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }
});