/**
 * Configuration Loader Module
 * Loads content from config.yaml and populates the HTML dynamically
 */

class ConfigLoader {
  constructor() {
    this.config = null;
  }

  /**
   * Load and parse YAML configuration file
   */
  async loadConfig() {
    try {
      const response = await fetch('./config.yaml');
      const yamlText = await response.text();
      
      // Parse YAML - we'll use a simple YAML parser for basic structure
      this.config = this.parseSimpleYAML(yamlText);
      
      return this.config;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  }

  /**
   * Simple YAML parser for our specific structure
   * This is a basic implementation - for production, consider using js-yaml library
   */
  parseSimpleYAML(yamlText) {
    try {
      const lines = yamlText.split('\n');
      const result = {};
      let currentPath = [];
      let currentObject = result;
      let indent = 0;
      let lastKey = '';

      for (let line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || line.trim() === '') continue;

        const lineIndent = line.length - line.trimStart().length;
        const trimmedLine = line.trim();

        // Handle arrays
        if (trimmedLine.startsWith('- ')) {
          const value = trimmedLine.substring(2).trim();
          
          // Ensure we have an array context
          if (lastKey && !Array.isArray(currentObject[lastKey])) {
            currentObject[lastKey] = [];
          }
          
          const targetArray = lastKey ? currentObject[lastKey] : currentObject;
          
          if (value.includes(':')) {
            // Object in array
            const obj = {};
            if (Array.isArray(targetArray)) {
              targetArray.push(obj);
            }
            this.parseObjectProperties(value, obj);
          } else {
            // Simple value in array
            if (Array.isArray(targetArray)) {
              targetArray.push(this.parseValue(value));
            }
          }
          continue;
        }

        // Handle key-value pairs
        if (trimmedLine.includes(':')) {
          const colonIndex = trimmedLine.indexOf(':');
          const key = trimmedLine.substring(0, colonIndex).trim();
          const value = trimmedLine.substring(colonIndex + 1).trim();

          // Adjust current path based on indentation
          if (lineIndent <= indent && currentPath.length > 0) {
            const steps = Math.floor((indent - lineIndent) / 2) + 1;
            currentPath = currentPath.slice(0, -steps);
            currentObject = this.getNestedValue(result, currentPath);
          }

          if (value === '' || value === '|') {
            // Object or multiline
            currentObject[key] = {};
            currentPath.push(key);
            currentObject = currentObject[key];
            lastKey = key;
          } else {
            // Simple value
            currentObject[key] = this.parseValue(value);
            lastKey = key;
          }

          indent = lineIndent;
        }
      }

      return result;
    } catch (error) {
      console.error('Error parsing YAML:', error);
      return {};
    }
  }

  /**
   * Parse object properties from a line
   */
  parseObjectProperties(line, obj) {
    const pairs = line.split(',');
    for (let pair of pairs) {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        obj[key] = this.parseValue(value);
      }
    }
  }

  /**
   * Parse individual values (handle quotes, numbers, booleans)
   */
  parseValue(value) {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    return value;
  }

  /**
   * Get nested value from object using path array
   */
  getNestedValue(obj, path) {
    return path.reduce((current, key) => {
      if (!current || typeof current !== 'object') return {};
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
  }

  /**
   * Populate HTML with configuration data
   */
  populateHTML() {
    if (!this.config) return;

    this.populatePersonalInfo();
    this.populateContactInfo();
    this.populateAboutSection();
    this.populateResumeSection();
    this.populatePortfolioSection();
    this.populateBlogSection();
    this.populateContactSection();
    this.populateNavigation();
  }

  /**
   * Populate personal information
   */
  populatePersonalInfo() {
    const info = this.config.personal_info;
    if (!info) return;

    // Update document title and meta tags
    document.title = `${info.name} - ${info.title} Portfolio`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && info.description) {
      metaDescription.content = info.description;
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && info.keywords) {
      metaKeywords.content = info.keywords;
    }

    // Update sidebar info
    const nameElement = document.querySelector('.name');
    if (nameElement && info.name) {
      nameElement.textContent = info.name;
      nameElement.title = info.name;
    }

    const titleElement = document.querySelector('.info-content .title');
    if (titleElement && info.title) {
      titleElement.textContent = info.title;
    }

    const avatarElement = document.querySelector('.avatar-box img');
    if (avatarElement && info.avatar) {
      avatarElement.src = info.avatar;
      avatarElement.alt = info.name;
    }

    // Update favicon
    if (info.favicon) {
      const faviconElement = document.querySelector('link[rel="shortcut icon"]');
      if (faviconElement) {
        faviconElement.href = info.favicon;
      }
    }
  }

  /**
   * Populate contact information
   */
  populateContactInfo() {
    const contact = this.config.contact_info;
    if (!contact) return;

    // Email
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && contact.email) {
      emailLink.href = `mailto:${contact.email}`;
      emailLink.textContent = contact.email;
    }

    // Phone
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink && contact.phone) {
      phoneLink.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
      phoneLink.textContent = contact.phone;
    }

    // Birthday
    const birthdayElement = document.querySelector('time');
    if (birthdayElement && contact.birthday) {
      birthdayElement.textContent = contact.birthday;
    }

    // Location
    const locationElement = document.querySelector('address');
    if (locationElement && contact.location) {
      locationElement.textContent = contact.location;
    }

    // Social links
    if (contact.social_links) {
      const socialLinks = document.querySelectorAll('.social-link');
      const socialIcons = ['logo-facebook', 'logo-twitter', 'logo-instagram'];
      const socialKeys = ['facebook', 'twitter', 'instagram'];
      
      socialLinks.forEach((link, index) => {
        if (socialKeys[index] && contact.social_links[socialKeys[index]]) {
          link.href = contact.social_links[socialKeys[index]];
        }
      });
    }
  }

  /**
   * Populate about section
   */
  populateAboutSection() {
    const about = this.config.about;
    if (!about) return;

    // About title
    const aboutTitle = document.querySelector('.about .article-title');
    if (aboutTitle && about.title) {
      aboutTitle.textContent = about.title;
    }

    // About text
    const aboutTextSection = document.querySelector('.about-text');
    if (aboutTextSection && about.description) {
      aboutTextSection.innerHTML = '';
      about.description.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        aboutTextSection.appendChild(p);
      });
    }

    // Services
    if (about.services) {
      const servicesTitle = document.querySelector('.service-title');
      if (servicesTitle && about.services.title) {
        servicesTitle.textContent = about.services.title;
      }

      const servicesList = document.querySelector('.service-list');
      if (servicesList && about.services.items) {
        servicesList.innerHTML = '';
        about.services.items.forEach(service => {
          const serviceItem = this.createServiceItem(service);
          servicesList.appendChild(serviceItem);
        });
      }
    }

    // Testimonials
    if (about.testimonials) {
      this.populateTestimonials(about.testimonials);
    }

    // Clients
    if (about.clients) {
      this.populateClients(about.clients);
    }
  }

  /**
   * Create service item HTML
   */
  createServiceItem(service) {
    const li = document.createElement('li');
    li.className = 'service-item';
    
    li.innerHTML = `
      <div class="service-icon-box">
        <img src="${service.icon}" alt="${service.title.toLowerCase()} icon" width="40">
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${service.title}</h4>
        <p class="service-item-text">${service.description}</p>
      </div>
    `;
    
    return li;
  }

  /**
   * Populate testimonials
   */
  populateTestimonials(testimonials) {
    const testimonialsTitle = document.querySelector('.testimonials-title');
    if (testimonialsTitle && testimonials.title) {
      testimonialsTitle.textContent = testimonials.title;
    }

    const testimonialsList = document.querySelector('.testimonials-list');
    if (testimonialsList && testimonials.items) {
      testimonialsList.innerHTML = '';
      testimonials.items.forEach(testimonial => {
        const testimonialItem = this.createTestimonialItem(testimonial);
        testimonialsList.appendChild(testimonialItem);
      });
    }
  }

  /**
   * Create testimonial item HTML
   */
  createTestimonialItem(testimonial) {
    const li = document.createElement('li');
    li.className = 'testimonials-item';
    
    li.innerHTML = `
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img src="${testimonial.avatar}" alt="${testimonial.name}" width="60" data-testimonials-avatar>
        </figure>
        <h4 class="h4 testimonials-item-title" data-testimonials-title>${testimonial.name}</h4>
        <div class="testimonials-text" data-testimonials-text>
          <p>${testimonial.text}</p>
        </div>
      </div>
    `;
    
    return li;
  }

  /**
   * Populate clients section
   */
  populateClients(clients) {
    const clientsTitle = document.querySelector('.clients-title');
    if (clientsTitle && clients.title) {
      clientsTitle.textContent = clients.title;
    }

    const clientsList = document.querySelector('.clients-list');
    if (clientsList && clients.logos) {
      clientsList.innerHTML = '';
      clients.logos.forEach(logo => {
        const clientItem = document.createElement('li');
        clientItem.className = 'clients-item';
        clientItem.innerHTML = `
          <a href="#">
            <img src="${logo}" alt="client logo">
          </a>
        `;
        clientsList.appendChild(clientItem);
      });
    }
  }

  /**
   * Populate resume section
   */
  populateResumeSection() {
    const resume = this.config.resume;
    if (!resume) return;

    // Resume title
    const resumeTitle = document.querySelector('.resume .article-title');
    if (resumeTitle && resume.title) {
      resumeTitle.textContent = resume.title;
    }

    // Education
    if (resume.education) {
      this.populateTimeline('education', resume.education);
    }

    // Experience
    if (resume.experience) {
      this.populateTimeline('experience', resume.experience);
    }

    // Skills
    if (resume.skills) {
      this.populateSkills(resume.skills);
    }
  }

  /**
   * Populate timeline sections (education/experience)
   */
  populateTimeline(type, timelineData) {
    const timelineSections = document.querySelectorAll('.timeline');
    const targetSection = type === 'education' ? timelineSections[0] : timelineSections[1];
    
    if (!targetSection) return;

    const titleElement = targetSection.querySelector('.h3');
    if (titleElement && timelineData.title) {
      titleElement.textContent = timelineData.title;
    }

    const timelineList = targetSection.querySelector('.timeline-list');
    if (timelineList && timelineData.items) {
      timelineList.innerHTML = '';
      timelineData.items.forEach(item => {
        const timelineItem = this.createTimelineItem(item);
        timelineList.appendChild(timelineItem);
      });
    }
  }

  /**
   * Create timeline item HTML
   */
  createTimelineItem(item) {
    const li = document.createElement('li');
    li.className = 'timeline-item';
    
    li.innerHTML = `
      <h4 class="h4 timeline-item-title">${item.title}</h4>
      <span>${item.period}</span>
      <p class="timeline-text">${item.description}</p>
    `;
    
    return li;
  }

  /**
   * Populate skills section
   */
  populateSkills(skills) {
    const skillsTitle = document.querySelector('.skills-title');
    if (skillsTitle && skills.title) {
      skillsTitle.textContent = skills.title;
    }

    const skillsList = document.querySelector('.skills-list');
    if (skillsList && skills.items) {
      skillsList.innerHTML = '';
      skills.items.forEach(skill => {
        const skillItem = this.createSkillItem(skill);
        skillsList.appendChild(skillItem);
      });
    }
  }

  /**
   * Create skill item HTML
   */
  createSkillItem(skill) {
    const li = document.createElement('li');
    li.className = 'skills-item';
    
    li.innerHTML = `
      <div class="title-wrapper">
        <h5 class="h5">${skill.name}</h5>
        <data value="${skill.percentage}">${skill.percentage}%</data>
      </div>
      <div class="skill-progress-bg">
        <div class="skill-progress-fill" style="width: ${skill.percentage}%;"></div>
      </div>
    `;
    
    return li;
  }

  /**
   * Populate portfolio section
   */
  populatePortfolioSection() {
    const portfolio = this.config.portfolio;
    if (!portfolio) return;

    // Portfolio title
    const portfolioTitle = document.querySelector('.portfolio .article-title');
    if (portfolioTitle && portfolio.title) {
      portfolioTitle.textContent = portfolio.title;
    }

    // Categories
    if (portfolio.categories) {
      this.populateFilterCategories(portfolio.categories);
    }

    // Projects
    if (portfolio.projects) {
      this.populateProjects(portfolio.projects);
    }
  }

  /**
   * Populate filter categories
   */
  populateFilterCategories(categories) {
    const filterList = document.querySelector('.filter-list');
    const selectList = document.querySelector('.select-list');

    if (filterList) {
      filterList.innerHTML = '';
      categories.forEach((category, index) => {
        const filterItem = document.createElement('li');
        filterItem.className = 'filter-item';
        filterItem.innerHTML = `<button ${index === 0 ? 'class="active"' : ''} data-filter-btn>${category}</button>`;
        filterList.appendChild(filterItem);
      });
    }

    if (selectList) {
      selectList.innerHTML = '';
      categories.forEach(category => {
        const selectItem = document.createElement('li');
        selectItem.className = 'select-item';
        selectItem.innerHTML = `<button data-select-item>${category}</button>`;
        selectList.appendChild(selectItem);
      });
    }
  }

  /**
   * Populate projects
   */
  populateProjects(projects) {
    const projectList = document.querySelector('.project-list');
    if (!projectList) return;

    projectList.innerHTML = '';
    projects.forEach(project => {
      const projectItem = this.createProjectItem(project);
      projectList.appendChild(projectItem);
    });
  }

  /**
   * Create project item HTML
   */
  createProjectItem(project) {
    const li = document.createElement('li');
    li.className = 'project-item active';
    li.setAttribute('data-filter-item', '');
    li.setAttribute('data-category', project.category.toLowerCase());
    
    li.innerHTML = `
      <a href="${project.link}">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${project.image}" alt="${project.alt}" loading="lazy">
        </figure>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${project.category}</p>
      </a>
    `;
    
    return li;
  }

  /**
   * Populate blog section
   */
  populateBlogSection() {
    const blog = this.config.blog;
    if (!blog) return;

    // Blog title
    const blogTitle = document.querySelector('.blog .article-title');
    if (blogTitle && blog.title) {
      blogTitle.textContent = blog.title;
    }

    // Blog posts
    if (blog.posts) {
      this.populateBlogPosts(blog.posts);
    }
  }

  /**
   * Populate blog posts
   */
  populateBlogPosts(posts) {
    const blogPostsList = document.querySelector('.blog-posts-list');
    if (!blogPostsList) return;

    blogPostsList.innerHTML = '';
    posts.forEach(post => {
      const blogPostItem = this.createBlogPostItem(post);
      blogPostsList.appendChild(blogPostItem);
    });
  }

  /**
   * Create blog post item HTML
   */
  createBlogPostItem(post) {
    const li = document.createElement('li');
    li.className = 'blog-post-item';
    
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    li.innerHTML = `
      <a href="${post.link}">
        <figure class="blog-banner-box">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </figure>
        <div class="blog-content">
          <div class="blog-meta">
            <p class="blog-category">${post.category}</p>
            <span class="dot"></span>
            <time datetime="${post.date}">${formattedDate}</time>
          </div>
          <h3 class="h3 blog-item-title">${post.title}</h3>
          <p class="blog-text">${post.excerpt}</p>
        </div>
      </a>
    `;
    
    return li;
  }

  /**
   * Populate contact section
   */
  populateContactSection() {
    const contact = this.config.contact;
    if (!contact) return;

    // Contact title
    const contactTitle = document.querySelector('.contact .article-title');
    if (contactTitle && contact.title) {
      contactTitle.textContent = contact.title;
    }

    // Form title
    const formTitle = document.querySelector('.form-title');
    if (formTitle && contact.form_title) {
      formTitle.textContent = contact.form_title;
    }

    // Map embed
    const mapIframe = document.querySelector('.mapbox iframe');
    if (mapIframe && contact.map_embed) {
      mapIframe.src = contact.map_embed;
    }

    // Form placeholders
    if (contact.form_fields) {
      const fullnameInput = document.querySelector('input[name="fullname"]');
      if (fullnameInput && contact.form_fields.fullname_placeholder) {
        fullnameInput.placeholder = contact.form_fields.fullname_placeholder;
      }

      const emailInput = document.querySelector('input[name="email"]');
      if (emailInput && contact.form_fields.email_placeholder) {
        emailInput.placeholder = contact.form_fields.email_placeholder;
      }

      const messageTextarea = document.querySelector('textarea[name="message"]');
      if (messageTextarea && contact.form_fields.message_placeholder) {
        messageTextarea.placeholder = contact.form_fields.message_placeholder;
      }

      const submitBtn = document.querySelector('.form-btn span');
      if (submitBtn && contact.form_fields.submit_text) {
        submitBtn.textContent = contact.form_fields.submit_text;
      }
    }
  }

  /**
   * Populate navigation
   */
  populateNavigation() {
    const navigation = this.config.navigation;
    if (!navigation) return;

    const navbarList = document.querySelector('.navbar-list');
    if (!navbarList) return;

    navbarList.innerHTML = '';
    navigation.forEach(navItem => {
      const navbarItem = document.createElement('li');
      navbarItem.className = 'navbar-item';
      navbarItem.innerHTML = `
        <button class="navbar-link ${navItem.active ? 'active' : ''}" data-nav-link>${navItem.name}</button>
      `;
      navbarList.appendChild(navbarItem);
    });
  }

  /**
   * Initialize the configuration loader
   */
  async init() {
    await this.loadConfig();
    this.populateHTML();
    
    // Reinitialize any JavaScript functionality that depends on dynamic content
    this.reinitializeEventListeners();
  }

  /**
   * Reinitialize event listeners for dynamically created content
   */
  reinitializeEventListeners() {
    // This would be called after populating HTML to ensure all event listeners work
    // with the new dynamic content. The main script.js handles most of this already.
    
    // Dispatch a custom event to signal that content has been loaded
    document.dispatchEvent(new CustomEvent('configLoaded'));
  }
}

// Export for use in other scripts
window.ConfigLoader = ConfigLoader;