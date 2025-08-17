/**
 * GitHub Pages Compatible Configuration Loader
 * Uses embedded JavaScript config instead of YAML to avoid CORS issues
 */

class GitHubPagesLoader {
  constructor() {
    this.config = null;
  }

  /**
   * Load configuration from embedded JavaScript
   */
  async loadConfig() {
    try {
      // Check if config is available from the embedded script
      if (window.PORTFOLIO_CONFIG) {
        this.config = window.PORTFOLIO_CONFIG;
        console.log('Loaded config from embedded JavaScript');
        return this.config;
      }
      
      // Fallback: try to load from YAML (for local development)
      try {
        const response = await fetch('./config.yaml');
        if (response.ok) {
          const yamlText = await response.text();
          this.config = this.parseSimpleYAML(yamlText);
          console.log('Loaded config from YAML file');
          return this.config;
        }
      } catch (yamlError) {
        console.log('YAML loading failed (expected on GitHub Pages):', yamlError.message);
      }
      
      // Final fallback
      this.config = this.getFallbackConfig();
      console.log('Using fallback configuration');
      return this.config;
      
    } catch (error) {
      console.error('Error loading config:', error);
      this.config = this.getFallbackConfig();
      return this.config;
    }
  }

  /**
   * Simple YAML parser (fallback for local development)
   */
  parseSimpleYAML(yamlText) {
    // Basic YAML parsing - simplified version
    const lines = yamlText.split('\n');
    const result = {};
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes(':') && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
        const [key, value] = trimmed.split(':').map(s => s.trim());
        if (key && value) {
          result[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
        }
      }
    }
    
    return result;
  }

  /**
   * Get fallback configuration
   */
  getFallbackConfig() {
    return {
      personal_info: {
        name: "Arun Naudiyal",
        title: "Senior Data Scientist",
        avatar: "./assets/images/my-avatar.png"
      },
      about: {
        title: "About me",
        description: [
          "I'm a Senior Data Scientist at SFL Scientific, working in the Innovation & Technology Operations division.",
          "My expertise spans across Generative AI, advanced Data Science methodologies, and Multi Agent Architectures."
        ]
      },
      resume: { title: "Resume" },
      portfolio: { title: "Portfolio" },
      blog: { title: "Blog" },
      contact: { title: "Contact" }
    };
  }

  /**
   * Parse individual values
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
  }

  /**
   * Populate personal information
   */
  populatePersonalInfo() {
    const info = this.config.personal_info;
    if (!info) return;

    // Update document title and meta tags
    if (info.name && info.title) {
      document.title = `${info.name} - ${info.title} Portfolio`;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && info.description) {
      metaDescription.content = info.description;
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
    if (about.services && about.services.items) {
      const servicesList = document.querySelector('.service-list');
      if (servicesList) {
        servicesList.innerHTML = '';
        about.services.items.forEach(service => {
          const serviceItem = this.createServiceItem(service);
          servicesList.appendChild(serviceItem);
        });
      }
    }

    // Testimonials
    if (about.testimonials && about.testimonials.items) {
      this.populateTestimonials(about.testimonials);
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
   * Populate other sections (simplified for GitHub Pages)
   */
  populateResumeSection() {
    const resume = this.config.resume;
    if (!resume) return;

    const resumeTitle = document.querySelector('.resume .article-title');
    if (resumeTitle && resume.title) {
      resumeTitle.textContent = resume.title;
    }
  }

  populatePortfolioSection() {
    const portfolio = this.config.portfolio;
    if (!portfolio) return;

    const portfolioTitle = document.querySelector('.portfolio .article-title');
    if (portfolioTitle && portfolio.title) {
      portfolioTitle.textContent = portfolio.title;
    }
  }

  populateBlogSection() {
    const blog = this.config.blog;
    if (!blog) return;

    const blogTitle = document.querySelector('.blog .article-title');
    if (blogTitle && blog.title) {
      blogTitle.textContent = blog.title;
    }
  }

  populateContactSection() {
    const contact = this.config.contact;
    if (!contact) return;

    const contactTitle = document.querySelector('.contact .article-title');
    if (contactTitle && contact.title) {
      contactTitle.textContent = contact.title;
    }
  }

  /**
   * Initialize the loader
   */
  async init() {
    await this.loadConfig();
    this.populateHTML();
    
    // Signal that content has been loaded
    document.dispatchEvent(new CustomEvent('configLoaded'));
  }
}

// Export for use in other scripts
window.GitHubPagesLoader = GitHubPagesLoader;