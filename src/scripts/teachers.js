// Teachers Management JavaScript with LocalStorage

const STORAGE_KEY = "emarks_teachers";

// Load teachers from localStorage or initialize with default data
function loadTeachers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading teachers:", e);
      return getDefaultTeachers();
    }
  }
  return getDefaultTeachers();
}

// Save teachers to localStorage
function saveTeachers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}

// Default teachers data
function getDefaultTeachers() {
  return [
    {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@school.com",
      phone: "+250 788 123 456",
      subject: "Mathematics",
      experience: 12,
      qualification: "PhD",
    },
    {
      name: "Mr. David Brown",
      email: "david.brown@school.com",
      phone: "+250 788 234 567",
      subject: "Physics",
      experience: 8,
      qualification: "Master's Degree",
    },
    {
      name: "Ms. Emily Wilson",
      email: "emily.wilson@school.com",
      phone: "+250 788 345 678",
      subject: "English Literature",
      experience: 10,
      qualification: "Master's Degree",
    },
    {
      name: "Prof. Michael Chen",
      email: "michael.chen@school.com",
      phone: "+250 788 456 789",
      subject: "Chemistry",
      experience: 15,
      qualification: "PhD",
    },
    {
      name: "Mrs. Jennifer Davis",
      email: "jennifer.davis@school.com",
      phone: "+250 788 567 890",
      subject: "Biology",
      experience: 7,
      qualification: "Master's Degree",
    },
    {
      name: "Mr. Robert Martinez",
      email: "robert.martinez@school.com",
      phone: "+250 788 678 901",
      subject: "History",
      experience: 9,
      qualification: "Bachelor's Degree",
    },
    {
      name: "Dr. Lisa Anderson",
      email: "lisa.anderson@school.com",
      phone: "+250 788 789 012",
      subject: "Computer Science",
      experience: 11,
      qualification: "PhD",
    },
    {
      name: "Ms. Amanda Taylor",
      email: "amanda.taylor@school.com",
      phone: "+250 788 890 123",
      subject: "Fine Arts",
      experience: 6,
      qualification: "Bachelor's Degree",
    },
  ];
}

let teachers = loadTeachers();
let editingIndex = null;

// Qualification colors
const qualificationColors = {
  PhD: "bg-purple-50 text-purple-600 border-purple-200",
  "Master's Degree": "bg-blue-50 text-blue-600 border-blue-200",
  "Bachelor's Degree": "bg-green-50 text-green-600 border-green-200",
  Diploma: "bg-orange-50 text-orange-600 border-orange-200",
  Certificate: "bg-gray-50 text-gray-600 border-gray-200",
};

// DOM Elements
const teachersGrid = document.getElementById("teachers-grid");
const addTeacherBtn = document.getElementById("add-teacher-btn");
const teacherModal = document.getElementById("teacher-modal");
const closeModal = document.getElementById("close-modal");
const cancelModal = document.getElementById("cancel-modal");
const saveTeacherBtn = document.getElementById("save-teacher");
const modalTitle = document.getElementById("modal-title");
const searchInput = document.getElementById("search-input");

// Sidebar toggle
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebarOverlay.classList.toggle("hidden");
});

sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
});

// Get initials from name
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Render teachers grid
function renderTeachersGrid(data = teachers) {
  teachersGrid.innerHTML = "";

  data.forEach((teacher, index) => {
    const colorClass =
      qualificationColors[teacher.qualification] ||
      qualificationColors["Certificate"];
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all";
    card.innerHTML = `
      <div class="flex items-start gap-4 mb-4">
        <div class="w-16 h-16 rounded-full bg-red-400 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
          ${getInitials(teacher.name)}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-slate-800 mb-1 truncate">${
            teacher.name
          }</h3>
          <p class="text-sm text-gray-600 font-medium truncate">${
            teacher.subject
          }</p>
          <span class="inline-block px-3 py-1 rounded-lg text-xs font-bold ${colorClass} border mt-2">
            ${teacher.qualification}
          </span>
        </div>
      </div>
      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i data-lucide="mail" class="w-4 h-4 text-gray-400"></i>
          <span class="truncate">${teacher.email}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i data-lucide="phone" class="w-4 h-4 text-gray-400"></i>
          <span>${teacher.phone}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i data-lucide="briefcase" class="w-4 h-4 text-gray-400"></i>
          <span>${teacher.experience} years experience</span>
        </div>
      </div>
      <div class="flex gap-2 pt-4 border-t border-gray-100">
        <button onclick="editTeacher(${teachers.indexOf(
          teacher
        )})" class="flex-1 text-blue-500 hover:bg-blue-50 py-2 rounded-lg font-bold transition-all text-sm">
          Edit
        </button>
        <button onclick="deleteTeacher(${teachers.indexOf(
          teacher
        )})" class="flex-1 text-red-500 hover:bg-red-50 py-2 rounded-lg font-bold transition-all text-sm">
          Delete
        </button>
      </div>
    `;
    teachersGrid.appendChild(card);
  });

  // Reinitialize lucide icons
  setTimeout(() => lucide.createIcons(), 10);
}

// Open modal for adding
addTeacherBtn.addEventListener("click", () => {
  editingIndex = null;
  modalTitle.textContent = "Add New Teacher";
  clearForm();
  teacherModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
});

// Close modal
function closeTeacherModal() {
  teacherModal.classList.add("hidden");
  clearForm();
}

closeModal.addEventListener("click", closeTeacherModal);
cancelModal.addEventListener("click", closeTeacherModal);

// Clear form
function clearForm() {
  document.getElementById("teacher-name").value = "";
  document.getElementById("teacher-email").value = "";
  document.getElementById("teacher-phone").value = "";
  document.getElementById("teacher-subject").value = "";
  document.getElementById("teacher-experience").value = "";
  document.getElementById("teacher-qualification").value = "Bachelor's Degree";
}

// Save teacher
saveTeacherBtn.addEventListener("click", () => {
  const teacher = {
    name: document.getElementById("teacher-name").value,
    email: document.getElementById("teacher-email").value,
    phone: document.getElementById("teacher-phone").value,
    subject: document.getElementById("teacher-subject").value,
    experience: parseInt(document.getElementById("teacher-experience").value),
    qualification: document.getElementById("teacher-qualification").value,
  };

  if (
    !teacher.name ||
    !teacher.email ||
    !teacher.phone ||
    !teacher.subject ||
    !teacher.experience ||
    !teacher.qualification
  ) {
    alert("Please fill in all fields");
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(teacher.email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (editingIndex !== null) {
    teachers[editingIndex] = teacher;
  } else {
    teachers.push(teacher);
  }

  saveTeachers();
  renderTeachersGrid();
  closeTeacherModal();
});

// Edit teacher
function editTeacher(index) {
  editingIndex = index;
  const teacher = teachers[index];

  modalTitle.textContent = "Edit Teacher";
  document.getElementById("teacher-name").value = teacher.name;
  document.getElementById("teacher-email").value = teacher.email;
  document.getElementById("teacher-phone").value = teacher.phone;
  document.getElementById("teacher-subject").value = teacher.subject;
  document.getElementById("teacher-experience").value = teacher.experience;
  document.getElementById("teacher-qualification").value =
    teacher.qualification;

  teacherModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
}

// Delete teacher
function deleteTeacher(index) {
  if (confirm("Are you sure you want to delete this teacher?")) {
    teachers.splice(index, 1);
    saveTeachers();
    renderTeachersGrid();
  }
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm) ||
      teacher.subject.toLowerCase().includes(searchTerm) ||
      teacher.qualification.toLowerCase().includes(searchTerm)
  );
  renderTeachersGrid(filtered);
});

// Initial render
renderTeachersGrid();
