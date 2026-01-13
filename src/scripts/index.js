// Dashboard JavaScript with LocalStorage Integration

// Initialize data storage keys
const STORAGE_KEYS = {
  STUDENTS: "students", // Match results.js key
  TEACHERS: "emarks_teachers",
  CLASSES: "emarks_classes",
  SUBJECTS: "emarks_subjects",
};

// Get data from localStorage or return default data
function getStorageData(key, defaultData) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored data:", e);
      return defaultData;
    }
  }
  return defaultData;
}

// Get all data from localStorage
function getAllData() {
  return {
    students: getStorageData(STORAGE_KEYS.STUDENTS, []),
    teachers: getStorageData(STORAGE_KEYS.TEACHERS, []),
    classes: getStorageData(STORAGE_KEYS.CLASSES, []),
    subjects: getStorageData(STORAGE_KEYS.SUBJECTS, []),
  };
}

// Calculate total marks
function calculateTotal(student) {
  return (
    student.math +
    student.english +
    student.science +
    student.history +
    student.physics
  );
}

// Calculate average
function calculateAverage(student) {
  const total = calculateTotal(student);
  return (total / 5).toFixed(1);
}

// Calculate grade using if/else (matching results.js)
function calculateGrade(average) {
  if (average >= 90) {
    return { grade: "A", color: "grade-A" };
  } else if (average >= 80) {
    return { grade: "B", color: "grade-B" };
  } else if (average >= 70) {
    return { grade: "C", color: "grade-C" };
  } else if (average >= 60) {
    return { grade: "D", color: "grade-D" };
  } else {
    return { grade: "F", color: "grade-F" };
  }
}

// Update statistics cards
function updateStats() {
  const data = getAllData();

  // Total Students - from actual results.js students array
  const totalStudents = data.students.length;
  document.getElementById("total-students").textContent = totalStudents;

  // Total Teachers
  document.getElementById("total-teachers").textContent = data.teachers.length;

  // Total Classes
  document.getElementById("total-classes").textContent = data.classes.length;

  // Total Subjects
  document.getElementById("total-subjects").textContent = data.subjects.length;
}

// Render recent students table
function renderRecentStudents() {
  const data = getAllData();
  const studentsData = data.students;
  const tableBody = document.getElementById("recent-students-table");
  const noStudentsDiv = document.getElementById("no-students");

  if (studentsData.length === 0) {
    tableBody.innerHTML = "";
    noStudentsDiv.classList.remove("hidden");
    return;
  }

  noStudentsDiv.classList.add("hidden");
  tableBody.innerHTML = "";

  // Show only the first 5 students (most recent)
  const recentStudents = studentsData.slice(0, 5);

  recentStudents.forEach((student) => {
    const average = parseFloat(calculateAverage(student));
    const gradeInfo = calculateGrade(average);

    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";
    row.innerHTML = `
      <td class="px-6 py-4 font-bold text-slate-700">${student.name}</td>
      <td class="px-6 py-4 text-gray-600 font-medium tracking-tight">${student.regNumber}</td>
      <td class="px-6 py-4 text-gray-900 font-semibold">${average}%</td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 rounded-lg text-xs font-bold ${gradeInfo.color}">
          ${gradeInfo.grade}
        </span>
      </td>
      <td class="px-6 py-4">
        <a
          href="results.html"
          class="text-red-400 font-bold hover:underline"
        >
          View Details
        </a>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Reinitialize lucide icons
  setTimeout(() => lucide.createIcons(), 10);
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const data = getAllData();
      const studentsData = data.students;
      const searchTerm = e.target.value.toLowerCase();

      if (searchTerm === "") {
        renderRecentStudents();
        return;
      }

      const filtered = studentsData.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.regNumber.toLowerCase().includes(searchTerm)
      );

      renderFilteredStudents(filtered);
    });
  }
}

// Render filtered students
function renderFilteredStudents(students) {
  const tableBody = document.getElementById("recent-students-table");
  const noStudentsDiv = document.getElementById("no-students");

  if (students.length === 0) {
    tableBody.innerHTML = "";
    noStudentsDiv.classList.remove("hidden");
    return;
  }

  noStudentsDiv.classList.add("hidden");
  tableBody.innerHTML = "";

  students.slice(0, 5).forEach((student) => {
    const average = parseFloat(calculateAverage(student));
    const gradeInfo = calculateGrade(average);

    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";
    row.innerHTML = `
      <td class="px-6 py-4 font-bold text-slate-700">${student.name}</td>
      <td class="px-6 py-4 text-gray-600 font-medium tracking-tight">${student.regNumber}</td>
      <td class="px-6 py-4 text-gray-900 font-semibold">${average}%</td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 rounded-lg text-xs font-bold ${gradeInfo.color}">
          ${gradeInfo.grade}
        </span>
      </td>
      <td class="px-6 py-4">
        <a
          href="results.html"
          class="text-red-400 font-bold hover:underline"
        >
          View Details
        </a>
      </td>
    `;
    tableBody.appendChild(row);
  });

  setTimeout(() => lucide.createIcons(), 10);
}

// Broadcast message functionality
function setupBroadcast() {
  const broadcastBtn = document.getElementById("broadcast-btn");
  const announcementText = document.getElementById("announcement-text");

  if (broadcastBtn && announcementText) {
    broadcastBtn.addEventListener("click", () => {
      const data = getAllData();
      const message = announcementText.value.trim();

      if (message === "") {
        alert("Please enter a message to broadcast");
        return;
      }

      // Simulate sending announcement
      const teacherCount = data.teachers.length;
      if (teacherCount > 0) {
        alert(
          `Announcement sent to all ${teacherCount} teachers!\n\nMessage: "${message}"`
        );
      } else {
        alert("No teachers found. Please add teachers first.");
      }
      announcementText.value = "";
    });
  }
}

// Sidebar toggle functionality
function setupSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebarToggle && sidebar && overlay) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
      }
    });
  }
}

// Listen for storage changes from other tabs/pages
window.addEventListener("storage", (e) => {
  // When students data changes (from results page), refresh dashboard
  if (e.key === "students" || (e.key && e.key.startsWith("emarks_"))) {
    updateStats();
    renderRecentStudents();
  }
});

// Refresh data periodically to catch same-tab updates
setInterval(() => {
  const currentCount = document.getElementById("total-students").textContent;
  const actualCount = getStorageData(STORAGE_KEYS.STUDENTS, []).length;

  // Only update if count changed
  if (parseInt(currentCount) !== actualCount) {
    updateStats();
    renderRecentStudents();
  }
}, 1000); // Check every second

// Add CSS for grade styling
const style = document.createElement("style");
style.textContent = `
  .grade-A {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
  .grade-B {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
  .grade-C {
    background: #fef3c7;
    color: #a16207;
    border: 1px solid #fde68a;
  }
  .grade-D {
    background: #fed7aa;
    color: #c2410c;
    border: 1px solid #fdba74;
  }
  .grade-F {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }
`;
document.head.appendChild(style);

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderRecentStudents();
  setupSearch();
  setupBroadcast();
  setupSidebar();

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "login.html";
  }
}
