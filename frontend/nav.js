const role = localStorage.getItem('role');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!localStorage.getItem('token')) {
    window.location.href = 'studentlogin.html';
}

const navLinks = {
    student: [
        { name: 'Dashboard', url: 'studentdashboard.html' },
        { name: 'Profile', url: 'profile.html' },
        { name: 'Resume', url: 'resume.html' },
        { name: 'Screening', url: 'screening.html' },
        { name: 'Results', url: 'results.html' },
        { name: 'Progress', url: 'progress.html' },
        { name: 'News', url: 'news.html' }
    ],
    admin: [
        { name: 'Dashboard', url: 'admindashboard.html' },
        { name: 'Companies', url: 'companies.html' },
        { name: 'Announcements', url: 'announcement.html' }
    ]
};

function initNav() {
    const navContainer = document.querySelector('.md\\:flex.items-center.space-x-1');
    if (navContainer) {
        const links = navLinks[role] || [];
        const currentPath = window.location.pathname.split('/').pop();

        navContainer.innerHTML = links.map(link => `
            <a class="px-4 h-16 flex items-center text-sm font-medium ${currentPath === link.url ? 'text-primary border-b-2 border-primary font-bold' : 'text-slate-500 hover:text-primary transition-colors'}" href="${link.url}">${link.name}</a>
        `).join('');
    }

    // Handle logout buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes('logout')) {
            btn.onclick = () => {
                localStorage.clear();
                window.location.href = 'studentlogin.html';
            };
        }
    });

    // Update welcome message if element exists
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
        if (p.textContent.includes('Welcome back') && user.name) {
            p.innerText = `Welcome back, ${user.name}! Review your progress and upcoming opportunities.`;
        }
    });
}

document.addEventListener('DOMContentLoaded', initNav);
