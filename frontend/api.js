const API_URL = 'http://localhost:3000/api';

const api = {
    // Auth
    studentLogin: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/student/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },
    adminLogin: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    // Data
    getCompanies: async () => {
        const res = await fetch(`${API_URL}/data/companies`);
        return res.json();
    },
    getAnnouncements: async () => {
        const res = await fetch(`${API_URL}/data/announcements`);
        return res.json();
    },
    getStudentProfile: async (id) => {
        const res = await fetch(`${API_URL}/data/students/${id}`, { cache: 'no-store' });
        return res.json();
    },
    updateStudentProfile: async (id, data) => {
        const res = await fetch(`${API_URL}/data/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // AI
    getResumeScore: async (id) => {
        const res = await fetch(`${API_URL}/ai/resume-score/${id}`);
        return res.json();
    },
    getSuggestions: async (id) => {
        const res = await fetch(`${API_URL}/ai/suggestions/${id}`);
        return res.json();
    }
};
