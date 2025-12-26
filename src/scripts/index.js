lucide.createIcons();


const sideBarToggler = document.querySelector("#sidebar-toggle");
const sideBarOverlay = document.querySelector("#sidebar-overlay");
const sidebar = document.querySelector('#sidebar');

function toggleSidebar(isOpen) {
    if (isOpen) {
        sidebar.classList.remove('-translate-x-full');
        sideBarOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.add('-translate-x-full');
        sideBarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

sideBarToggler.addEventListener('click', () => toggleSidebar(true));
sideBarOverlay.addEventListener('click', () => toggleSidebar(false));

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) { 
        toggleSidebar(false); 
    }
});