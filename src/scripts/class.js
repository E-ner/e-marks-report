class SessionManager {
    constructor() {
        
        this.sessions = JSON.parse(localStorage.getItem('student_sessions')) || [];
        this.render(); 
    }

    // CREATE
    handleCreate() {
        const className = document.getElementById('className').value;
        if (className) {
            const newSession = {
                id: Date.now(),
                className
                
            };

            this.sessions.push(newSession);
            this.saveAndSync();
            this.clearForm();
        } else {
            alert("Please fill in all fields");
        }
    }

    // DELETE
    deleteSession(id) {
        this.sessions = this.sessions.filter(s => s.id !== id);
        this.saveAndSync();
    }

    // SEARCH
    handleSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = this.sessions.filter(s => 
            s.className.toLowerCase().includes(query)
        );
        this.render(filtered);
    }

    // SORTING
    sortSessions(key) {
        this.sessions.sort((a, b) => {
            if (typeof a[key] === 'string') return a[key].localeCompare(b[key]);
            return b[key] - a[key]; 
        });
        this.saveAndSync();
    }

    // DATA SYNC
    saveAndSync() {
        localStorage.setItem('student_sessions', JSON.stringify(this.sessions));
        this.render();
    }

    clearForm() {
        document.getElementById('className').value = '';
   
    }

    // UI RENDER
    render(dataToDisplay = this.sessions) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = dataToDisplay.map(s => `
            <tr>
                <td>${s.className}</td>
                
                <td>
                    <button class="delete-btn" onclick="app.deleteSession(${s.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize the App
const app = new SessionManager();