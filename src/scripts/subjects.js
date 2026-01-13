// Subjects Management JavaScript with LocalStorage

const STORAGE_KEY = "emarks_subjects";

// Load subjects from localStorage or initialize with default data
function loadSubjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading subjects:", e);
      return getDefaultSubjects();
    }
  }
  return getDefaultSubjects();
}

// Save subjects to localStorage
function saveSubjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

// Default subjects data
function getDefaultSubjects() {
  return [
    {
      code: "MATH101",
      name: "Mathematics",
      category: "Mathematics",
      description:
        "Advanced mathematics covering algebra, calculus, and geometry",
    },
    {
      code: "ENG101",
      name: "English Literature",
      category: "Languages",
      description: "Study of classic and contemporary literature",
    },
    {
      code: "PHY101",
      name: "Physics",
      category: "Science",
      description:
        "Classical and modern physics including mechanics and electromagnetism",
    },
    {
      code: "CHEM101",
      name: "Chemistry",
      category: "Science",
      description: "Organic, inorganic, and physical chemistry",
    },
    {
      code: "BIO101",
      name: "Biology",
      category: "Science",
      description: "Study of living organisms and life processes",
    },
    {
      code: "HIST101",
      name: "History",
      category: "Humanities",
      description: "World history and historical analysis",
    },
    {
      code: "GEO101",
      name: "Geography",
      category: "Humanities",
      description: "Physical and human geography",
    },
    {
      code: "CS101",
      name: "Computer Science",
      category: "Science",
      description: "Programming, algorithms, and computer systems",
    },
    {
      code: "ART101",
      name: "Fine Arts",
      category: "Arts",
      description: "Visual arts, painting, and sculpture",
    },
    {
      code: "MUS101",
      name: "Music",
      category: "Arts",
      description: "Music theory, history, and performance",
    },
    {
      code: "PE101",
      name: "Physical Education",
      category: "Other",
      description: "Sports, fitness, and health education",
    },
    {
      code: "ECO101",
      name: "Economics",
      category: "Humanities",
      description: "Microeconomics and macroeconomics principles",
    },
  ];
}

let subjects = loadSubjects();
let editingIndex = null;

// Category colors
const categoryColors = {
  Science: "bg-purple-50 text-purple-600 border-purple-200",
  Mathematics: "bg-blue-50 text-blue-600 border-blue-200",
  Languages: "bg-green-50 text-green-600 border-green-200",
  Humanities: "bg-orange-50 text-orange-600 border-orange-200",
  Arts: "bg-pink-50 text-pink-600 border-pink-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

// DOM Elements
const subjectsGrid = document.getElementById("subjects-grid");
const addSubjectBtn = document.getElementById("add-subject-btn");
const subjectModal = document.getElementById("subject-modal");
const closeModal = document.getElementById("close-modal");
const cancelModal = document.getElementById("cancel-modal");
const saveSubjectBtn = document.getElementById("save-subject");
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

// Render subjects grid
function renderSubjectsGrid(data = subjects) {
  subjectsGrid.innerHTML = "";

  data.forEach((subject, index) => {
    const colorClass =
      categoryColors[subject.category] || categoryColors["Other"];
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all";
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-lg text-xs font-bold ${colorClass} border">
              ${subject.category}
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-1">${subject.name}</h3>
          <p class="text-sm text-gray-500 font-medium tracking-tight">${
            subject.code
          }</p>
        </div>
      </div>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">${
        subject.description
      }</p>
      <div class="flex gap-2 pt-4 border-t border-gray-100">
        <button onclick="editSubject(${subjects.indexOf(
          subject
        )})" class="flex-1 text-blue-500 hover:bg-blue-50 py-2 rounded-lg font-bold transition-all text-sm">
          Edit
        </button>
        <button onclick="deleteSubject(${subjects.indexOf(
          subject
        )})" class="flex-1 text-red-500 hover:bg-red-50 py-2 rounded-lg font-bold transition-all text-sm">
          Delete
        </button>
      </div>
    `;
    subjectsGrid.appendChild(card);
  });
}

// Open modal for adding
addSubjectBtn.addEventListener("click", () => {
  editingIndex = null;
  modalTitle.textContent = "Add New Subject";
  clearForm();
  subjectModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
});

// Close modal
function closeSubjectModal() {
  subjectModal.classList.add("hidden");
  clearForm();
}

closeModal.addEventListener("click", closeSubjectModal);
cancelModal.addEventListener("click", closeSubjectModal);

// Clear form
function clearForm() {
  document.getElementById("subject-code").value = "";
  document.getElementById("subject-name").value = "";
  document.getElementById("subject-category").value = "Science";
  document.getElementById("subject-description").value = "";
}

// Save subject
saveSubjectBtn.addEventListener("click", () => {
  const subject = {
    code: document.getElementById("subject-code").value,
    name: document.getElementById("subject-name").value,
    category: document.getElementById("subject-category").value,
    description: document.getElementById("subject-description").value,
  };

  if (
    !subject.code ||
    !subject.name ||
    !subject.category ||
    !subject.description
  ) {
    alert("Please fill in all fields");
    return;
  }

  if (editingIndex !== null) {
    subjects[editingIndex] = subject;
  } else {
    subjects.push(subject);
  }

  saveSubjects();
  renderSubjectsGrid();
  closeSubjectModal();
});

// Edit subject
function editSubject(index) {
  editingIndex = index;
  const subject = subjects[index];

  modalTitle.textContent = "Edit Subject";
  document.getElementById("subject-code").value = subject.code;
  document.getElementById("subject-name").value = subject.name;
  document.getElementById("subject-category").value = subject.category;
  document.getElementById("subject-description").value = subject.description;

  subjectModal.classList.remove("hidden");
  setTimeout(() => lucide.createIcons(), 10);
}

// Delete subject
function deleteSubject(index) {
  if (confirm("Are you sure you want to delete this subject?")) {
    subjects.splice(index, 1);
    saveSubjects();
    renderSubjectsGrid();
  }
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm) ||
      subject.category.toLowerCase().includes(searchTerm)
  );
  renderSubjectsGrid(filtered);
});

// Initial render
renderSubjectsGrid();
