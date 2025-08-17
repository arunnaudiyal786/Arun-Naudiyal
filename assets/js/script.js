'use strict';

// Initialize configuration loader when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize basic event listeners first
  initializeEventListeners();
  
  // Then load dynamic content
  const configLoader = new ConfigLoader();
  await configLoader.init();
});

// Listen for config loaded event to reinitialize dynamic content event listeners
document.addEventListener('configLoaded', function() {
  // Reinitialize dynamic content event listeners
  initializeTestimonialModals();
  initializePortfolioFilters();
  
  // Ensure navigation is still working
  initializeNavigation();
});



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// Initialize all event listeners
function initializeEventListeners() {
  initializeSidebar();
  initializeTestimonialModals();
  initializePortfolioFilters();
  initializeContactForm();
  initializeNavigation();
}

// Sidebar functionality
function initializeSidebar() {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
  }
}



// Testimonials modal functionality
function initializeTestimonialModals() {
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variables
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  if (!modalContainer || !modalCloseBtn || !overlay) return;

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // add click event to all modal items
  testimonialsItem.forEach(function(item) {
    item.addEventListener("click", function () {
      if (modalImg && modalTitle && modalText) {
        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      }
      testimonialsModalFunc();
    });
  });

  // add click event to modal close button
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// Portfolio filter functionality
function initializePortfolioFilters() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  if (!select || selectItems.length === 0) return;

  // Filter function
  const filterFunc = function (selectedValue) {
    filterItems.forEach(function(item) {
      if (selectedValue === "all") {
        item.classList.add("active");
      } else if (selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Custom select functionality
  select.addEventListener("click", function () { elementToggleFunc(this); });

  // Add event to all select items
  selectItems.forEach(function(item) {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // Add event to all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(function(btn) {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
}



// Contact form functionality
function initializeContactForm() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  if (!form || formInputs.length === 0 || !formBtn) return;

  // Add event to all form input fields
  formInputs.forEach(function(input) {
    input.addEventListener("input", function () {
      // Check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
}



// Page navigation functionality
function initializeNavigation() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  if (navigationLinks.length === 0 || pages.length === 0) return;

  // Add event to all nav links
  navigationLinks.forEach(function(navLink) {
    navLink.addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase();
      
      pages.forEach(function(page, index) {
        if (targetPage === page.dataset.page) {
          page.classList.add("active");
          navigationLinks[index].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          page.classList.remove("active");
          navigationLinks[index].classList.remove("active");
        }
      });
    });
  });
}