// results.js - Student Result Management System

let students = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  loadStudents();
  setupEventListeners();
  renderStudents();
  updateStats();
});

// Load students from localStorage
function loadStudents() {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
  } else {
    // Add sample data
    students = [
      {
        id: Date.now(),
        name: "Alice Smith",
        regNumber: "REG-2024-001",
        math: 85,
        english: 92,
        science: 88,
        history: 90,
        physics: 87,
      },
      {
        id: Date.now() + 1,
        name: "Bob Kevin",
        regNumber: "REG-2024-042",
        math: 78,
        english: 82,
        science: 75,
        history: 80,
        physics: 79,
      },
      {
        id: Date.now() + 2,
        name: "Charlie Brown",
        regNumber: "REG-2024-103",
        math: 65,
        english: 70,
        science: 68,
        history: 72,
        physics: 66,
      },
    ];
    saveStudents();
  }
}

// Save students to localStorage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
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
  return (total / 5).toFixed(2);
}

// Calculate grade using if/else
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

// Setup event listeners
function setupEventListeners() {
  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    });
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderStudents();
    });
  }

  // Sort functionality
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      renderStudents();
    });
  }

  // Form submission
  const form = document.getElementById("addStudentForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      addStudent();
    });
  }

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Validate form inputs
function validateForm() {
  let isValid = true;
  const errors = {};

  // Clear previous errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll("input")
    .forEach((el) => el.classList.remove("error-input"));

  // Validate name
  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    errors.name = "Name is required";
    isValid = false;
  }

  // Validate reg number
  const regNumber = document.getElementById("regNumber").value.trim();
  if (!regNumber) {
    errors.regNumber = "Registration number is required";
    isValid = false;
  }

  // Validate marks
  const subjects = ["math", "english", "science", "history", "physics"];
  subjects.forEach((subject) => {
    const input = document.getElementById(subject);
    const value = input.value;

    if (!value) {
      errors[subject] = "Required";
      isValid = false;
    } else {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0 || num > 100) {
        errors[subject] = "Must be 0-100";
        isValid = false;
      }
    }
  });

  // Display errors
  for (const field in errors) {
    const errorEl = document.getElementById(field + "Error");
    const inputEl = document.getElementById(
      field === "name"
        ? "studentName"
        : field === "regNumber"
        ? "regNumber"
        : field
    );

    if (errorEl) {
      errorEl.textContent = errors[field];
    }
    if (inputEl) {
      inputEl.classList.add("error-input");
    }
  }

  return isValid;
}

// Add new student
function addStudent() {
  if (!validateForm()) {
    return;
  }

  const newStudent = {
    id: Date.now(),
    name: document.getElementById("studentName").value.trim(),
    regNumber: document.getElementById("regNumber").value.trim(),
    math: parseFloat(document.getElementById("math").value),
    english: parseFloat(document.getElementById("english").value),
    science: parseFloat(document.getElementById("science").value),
    history: parseFloat(document.getElementById("history").value),
    physics: parseFloat(document.getElementById("physics").value),
  };

  students.unshift(newStudent); // Add to beginning for animation
  saveStudents();
  closeAddModal();
  renderStudents();
  updateStats();

  // Reset form
  document.getElementById("addStudentForm").reset();
}

// Delete student
function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter((s) => s.id !== id);
    saveStudents();
    renderStudents();
    updateStats();
  }
}

// Filter and sort students
function getFilteredAndSortedStudents() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortBy = document.getElementById("sortSelect").value;

  // Filter
  let filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.regNumber.toLowerCase().includes(searchTerm)
  );

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "average") {
      return calculateAverage(b) - calculateAverage(a);
    } else if (sortBy === "total") {
      return calculateTotal(b) - calculateTotal(a);
    }
    return 0;
  });

  return filtered;
}

// Render students table
function renderStudents() {
  const tbody = document.getElementById("resultsTable");
  const noResults = document.getElementById("noResults");
  const filtered = getFilteredAndSortedStudents();

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    if (noResults) {
      noResults.classList.remove("hidden");
    }
    return;
  }

  if (noResults) {
    noResults.classList.add("hidden");
  }

  tbody.innerHTML = filtered
    .map((student, index) => {
      const total = calculateTotal(student);
      const average = calculateAverage(student);
      const gradeInfo = calculateGrade(parseFloat(average));
      const progressPercentage = (parseFloat(average) / 100) * 100;

      return `
            <tr class="hover:bg-gray-50/50 transition-colors ${
              index === 0 ? "row-animate" : ""
            }">
                <td class="px-6 py-4 font-bold text-slate-700">${
                  student.name
                }</td>
                <td class="px-6 py-4 text-gray-500 font-medium tracking-tighter">${
                  student.regNumber
                }</td>
                <td class="px-6 py-4 text-gray-600">${student.math}</td>
                <td class="px-6 py-4 text-gray-600">${student.english}</td>
                <td class="px-6 py-4 text-gray-600">${student.science}</td>
                <td class="px-6 py-4 text-gray-600">${student.history}</td>
                <td class="px-6 py-4 text-gray-600">${student.physics}</td>
                <td class="px-6 py-4 font-bold text-slate-800">${total}</td>
                <td class="px-6 py-4 font-bold text-blue-600">${average}</td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-lg text-xs font-bold ${
                      gradeInfo.color
                    }">
                        ${gradeInfo.grade}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="progress-bar h-2.5 rounded-full ${
                          gradeInfo.grade === "A"
                            ? "bg-green-600"
                            : gradeInfo.grade === "B"
                            ? "bg-blue-600"
                            : gradeInfo.grade === "C"
                            ? "bg-yellow-600"
                            : gradeInfo.grade === "D"
                            ? "bg-orange-600"
                            : "bg-red-600"
                        }" style="width: ${progressPercentage}%"></div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <button onclick="deleteStudent(${student.id})" 
                        class="text-red-600 font-bold hover:underline">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  // Reinitialize icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Update statistics
function updateStats() {
  const totalStudentsEl = document.getElementById("totalStudents");
  const averageScoreEl = document.getElementById("averageScore");
  const topPerformerEl = document.getElementById("topPerformer");
  const passRateEl = document.getElementById("passRate");

  // Total students
  if (totalStudentsEl) {
    totalStudentsEl.textContent = students.length;
  }

  if (students.length === 0) {
    if (averageScoreEl) averageScoreEl.textContent = "0";
    if (topPerformerEl) topPerformerEl.textContent = "-";
    if (passRateEl) passRateEl.textContent = "0%";
    return;
  }

  // Average score
  const totalAverage = students.reduce(
    (sum, s) => sum + parseFloat(calculateAverage(s)),
    0
  );
  const classAverage = (totalAverage / students.length).toFixed(2);
  if (averageScoreEl) {
    averageScoreEl.textContent = classAverage;
  }

  // Top performer
  const topStudent = students.reduce((top, s) => {
    return parseFloat(calculateAverage(s)) > parseFloat(calculateAverage(top))
      ? s
      : top;
  }, students[0]);
  if (topPerformerEl) {
    topPerformerEl.textContent = topStudent.name.split(" ")[0];
  }

  // Pass rate (60% and above)
  const passCount = students.filter(
    (s) => parseFloat(calculateAverage(s)) >= 60
  ).length;
  const passRate = ((passCount / students.length) * 100).toFixed(0);
  if (passRateEl) {
    passRateEl.textContent = passRate + "%";
  }
}

// Modal functions
function openAddModal() {
  const modal = document.getElementById("addModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeAddModal() {
  const modal = document.getElementById("addModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Clear form
  document.getElementById("addStudentForm").reset();

  // Clear errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll("input")
    .forEach((el) => el.classList.remove("error-input"));
}

// Close modal on outside click
document.addEventListener("click", function (e) {
  const modal = document.getElementById("addModal");
  if (e.target === modal) {
    closeAddModal();
  }
});
