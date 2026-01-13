// Classes Management JavaScript with LocalStorage

const STORAGE_KEY = "emarks_classes";

// Load classes from localStorage or initialize with default data
function loadClasses() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading classes:", e);
      return getDefaultClasses();
    }
  }
  return getDefaultClasses();
}

// Save classes to localStorage
function saveClasses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

// Default classes data
function getDefaultClasses() {
  return [
    {
      name: "Senior 1 A",
      grade: "Senior 1",
      teacher: "Ms. Emily Wilson",
      students: 32,
      room: "Room 101",
      year: "2024-2025",
    },
    {
      name: "Senior 1 B",
      grade: "Senior 1",
      teacher: "Mr. Robert Martinez",
      students: 30,
      room: "Room 102",
      year: "2024-2025",
    },
    {
      name: "Senior 2 A",
      grade: "Senior 2",
      teacher: "Dr. Sarah Johnson",
      students: 28,
      room: "Room 201",
      year: "2024-2025",
    },
    {
      name: "Senior 2 B",
      grade: "Senior 2",
      teacher: "Mr. David Brown",
      students: 29,
      room: "Room 202",
      year: "2024-2025",
    },
    {
      name: "Senior 3 A",
      grade: "Senior 3",
      teacher: "Prof. Michael Chen",
      students: 26,
      room: "Room 301",
      year: "2024-2025",
    },
    {
      name: "Senior 3 B",
      grade: "Senior 3",
      teacher: "Mrs. Jennifer Davis",
      students: 27,
      room: "Room 302",
      year: "2024-2025",
    },
    {
      name: "Senior 4 A",
      grade: "Senior 4",
      teacher: "Dr. Lisa Anderson",
      students: 25,
      room: "Room 401",
      year: "2024-2025",
    },
    {
      name: "Senior 5 A",
      grade: "Senior 5",
      teacher: "Ms. Amanda Taylor",
      students: 24,
      room: "Room 501",
      year: "2024-2025",
    },
    {
      name: "Senior 6 A",
      grade: "Senior 6",
      teacher: "Dr. Sarah Johnson",
      students: 22,
      room: "Room 601",
      year: "2024-2025",
    },
  ];
}

let classes = loadClasses();
let editingIndex = null;

// Grade level colors
const gradeColors = {
  "Senior 1": "bg-blue-50 text-blue-600 border-blue-200",
  "Senior 2": "bg-green-50 text-green-600 border-green-200",
  "Senior 3": "bg-purple-50 text-purple-600 border-purple-200",
  "Senior 4": "bg-orange-50 text-orange-600 border-orange-200",
  "Senior 5": "bg-pink-50 text-pink-600 border-pink-200",
  "Senior 6": "bg-red-50 text-red-600 border-red-200",
};

// DOM Elements
const classesTableBody = document.getElementById("classes-table-body");
const emptyState = document.getElementById("empty-state");
const addClassBtn = document.getElementById("add-class-btn");
const classModal = document.getElementById("class-modal");
const closeModal = document.getElementById("close-modal");
const cancelModal = document.getElementById("cancel-modal");
const saveClassBtn = document.getElementById("save-class");
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

// Render classes table
function renderClassesTable(data = classes) {
  classesTableBody.innerHTML = "";

  if (data.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  data.forEach((classItem, index) => {
    const colorClass = gradeColors[classItem.grade] || gradeColors["Senior 1"];
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-lg bg-red-400 text-white flex items-center justify-center font-bold text-sm mr-3">
            ${classItem.name.split(" ")[1]}
          </div>
          <div class="text-sm font-bold text-slate-800">${classItem.name}</div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 rounded-lg text-xs font-bold ${colorClass} border">
          ${classItem.grade}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${classItem.teacher}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center gap-2">
          <i data-lucide="users" class="w-4 h-4 text-gray-400"></i>
          <span class="text-sm font-medium text-gray-900">${
            classItem.students
          }</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center gap-2">
          <i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>
          <span class="text-sm text-gray-900">${classItem.room}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-600">${classItem.year}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-center">
        <div class="flex items-center justify-center gap-2">
          <button 
            onclick="editClass(${classes.indexOf(classItem)})" 
            class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit"
          >
            <i data-lucide="edit-2" class="w-4 h-4"></i>
          </button>
          <button 
            onclick="deleteClass(${classes.indexOf(classItem)})" 
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    classesTableBody.appendChild(row);
  });

  // Reinitialize lucide icons
  setTimeout(() => lucide.createIcons(), 10);
}

// Open modal for adding
addClassBtn.addEventListener("click", () => {
  editingIndex = null;
  modalTitle.textContent = "Add New Class";
  clearForm();
  classModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
});

// Close modal
function closeClassModal() {
  classModal.classList.add("hidden");
  clearForm();
}

closeModal.addEventListener("click", closeClassModal);
cancelModal.addEventListener("click", closeClassModal);

// Clear form
function clearForm() {
  document.getElementById("class-name").value = "";
  document.getElementById("class-grade").value = "Senior 1";
  document.getElementById("class-teacher").value = "";
  document.getElementById("class-students").value = "";
  document.getElementById("class-room").value = "";
  document.getElementById("class-year").value = "";
}

// Save class
saveClassBtn.addEventListener("click", () => {
  const classItem = {
    name: document.getElementById("class-name").value,
    grade: document.getElementById("class-grade").value,
    teacher: document.getElementById("class-teacher").value,
    students: parseInt(document.getElementById("class-students").value),
    room: document.getElementById("class-room").value,
    year: document.getElementById("class-year").value,
  };

  if (
    !classItem.name ||
    !classItem.grade ||
    !classItem.teacher ||
    !classItem.students ||
    !classItem.room ||
    !classItem.year
  ) {
    alert("Please fill in all fields");
    return;
  }

  if (isNaN(classItem.students) || classItem.students < 0) {
    alert("Please enter a valid number of students");
    return;
  }

  if (editingIndex !== null) {
    classes[editingIndex] = classItem;
  } else {
    classes.push(classItem);
  }

  saveClasses();
  renderClassesTable();
  closeClassModal();
});

// Edit class
function editClass(index) {
  editingIndex = index;
  const classItem = classes[index];

  modalTitle.textContent = "Edit Class";
  document.getElementById("class-name").value = classItem.name;
  document.getElementById("class-grade").value = classItem.grade;
  document.getElementById("class-teacher").value = classItem.teacher;
  document.getElementById("class-students").value = classItem.students;
  document.getElementById("class-room").value = classItem.room;
  document.getElementById("class-year").value = classItem.year;

  classModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
}

// Delete class
function deleteClass(index) {
  if (confirm("Are you sure you want to delete this class?")) {
    classes.splice(index, 1);
    saveClasses();
    renderClassesTable();
  }
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm) ||
      classItem.grade.toLowerCase().includes(searchTerm) ||
      classItem.teacher.toLowerCase().includes(searchTerm) ||
      classItem.room.toLowerCase().includes(searchTerm)
  );
  renderClassesTable(filtered);
});

// Initial render
renderClassesTable();
