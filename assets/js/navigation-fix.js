/**
 * Navigation Fix - Ensures tab navigation works properly
 * This script runs independently of the config loader
 */

// Ensure navigation works immediately when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing navigation fix...');
  
  // Initialize navigation immediately
  setupNavigation();
  
  // Also reinitialize after a short delay to ensure dynamic content is loaded
  setTimeout(setupNavigation, 1000);
});

function setupNavigation() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");
  
  console.log(`Found ${navigationLinks.length} nav links and ${pages.length} pages`);
  
  if (navigationLinks.length === 0 || pages.length === 0) {
    console.warn('Navigation elements not found');
    return;
  }
  
  // Remove any existing event listeners by cloning elements
  navigationLinks.forEach(function(navLink, index) {
    const newNavLink = navLink.cloneNode(true);
    navLink.parentNode.replaceChild(newNavLink, navLink);
    
    // Add fresh event listener
    newNavLink.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetPage = this.innerHTML.toLowerCase().trim();
      console.log('Navigation clicked:', targetPage);
      
      // Update navigation active states
      document.querySelectorAll("[data-nav-link]").forEach(function(link) {
        link.classList.remove("active");
      });
      this.classList.add("active");
      
      // Update page active states
      document.querySelectorAll("[data-page]").forEach(function(page) {
        page.classList.remove("active");
        if (page.dataset.page === targetPage) {
          page.classList.add("active");
          console.log('Activated page:', targetPage);
        }
      });
      
      // Scroll to top
      window.scrollTo(0, 0);
    });
  });
  
  console.log('Navigation setup complete');
}

// Also make navigation available globally for debugging
window.setupNavigation = setupNavigation;