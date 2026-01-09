// index.js - Sidebar and general navigation scripts

document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebarToggle && sidebar && overlay) {
    // Toggle sidebar
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener("click", function () {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    });

    // Close sidebar on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
      }
    });
  }

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Clear any session data if needed
    // localStorage.removeItem('userSession');
    window.location.href = "login.html";
  }
}
