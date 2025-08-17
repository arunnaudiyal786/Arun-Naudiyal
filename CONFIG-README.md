# Dynamic Configuration System

This portfolio website now supports dynamic content loading through a YAML configuration file. All text content, images, and other data can be modified through the `config.yaml` file without touching the HTML.

## How it Works

The system consists of:

1. **config.yaml** - Contains all the dynamic content in a structured format
2. **config-loader.js** - JavaScript module that loads and parses the YAML file
3. **Updated HTML** - Now contains minimal content that gets populated dynamically

## Configuration Structure

The `config.yaml` file is organized into the following main sections:

### Personal Information
```yaml
personal_info:
  name: "Your Name"
  title: "Your Professional Title"
  description: "Meta description for SEO"
  keywords: "Comma-separated keywords"
  avatar: "./path/to/avatar.png"
  favicon: "./path/to/favicon.ico"
```

### Contact Information
```yaml
contact_info:
  email: "your.email@domain.com"
  phone: "+1 (234) 567-8901"
  birthday: "Your birthday or 'Available on Request'"
  location: "Your location"
  social_links:
    facebook: "https://facebook.com/yourprofile"
    twitter: "https://twitter.com/yourprofile"
    instagram: "https://instagram.com/yourprofile"
```

### About Section
```yaml
about:
  title: "About me"
  description:
    - "First paragraph of your about section"
    - "Second paragraph of your about section"
  
  services:
    title: "What I'm doing"
    items:
      - title: "Service Name"
        description: "Service description"
        icon: "./path/to/icon.svg"
```

### Resume Section
```yaml
resume:
  title: "Resume"
  
  education:
    title: "Education"
    icon: "book-outline"
    items:
      - title: "Degree Name"
        period: "2020 — 2024"
        description: "Description of your education"
  
  experience:
    title: "Experience"
    icon: "book-outline"
    items:
      - title: "Job Title - Company"
        period: "2020 — Present"
        description: "Description of your role"
  
  skills:
    title: "My skills"
    items:
      - name: "Skill Name"
        percentage: 95
```

### Portfolio Section
```yaml
portfolio:
  title: "Portfolio"
  
  categories:
    - "All"
    - "Category 1"
    - "Category 2"

  projects:
    - title: "Project Name"
      category: "Category 1"
      image: "./path/to/project-image.jpg"
      link: "https://project-link.com"
      alt: "Alt text for image"
```

### Blog Section
```yaml
blog:
  title: "Blog"
  posts:
    - title: "Blog Post Title"
      category: "Category"
      date: "2024-01-15"
      excerpt: "Short description of the blog post"
      image: "./path/to/blog-image.jpg"
      link: "https://blog-post-link.com"
```

### Contact Section
```yaml
contact:
  title: "Contact"
  form_title: "Contact Form"
  map_embed: "Google Maps embed URL"
  form_fields:
    fullname_placeholder: "Full name"
    email_placeholder: "Email address"
    message_placeholder: "Your Message"
    submit_text: "Send Message"
```

### Navigation
```yaml
navigation:
  - name: "About"
    active: true
  - name: "Resume"
    active: false
  - name: "Portfolio"
    active: false
  - name: "Blog"
    active: false
  - name: "Contact"
    active: false
```

## How to Update Content

1. **Edit config.yaml** - Modify any content in the YAML file
2. **Save the file** - The changes will be loaded automatically when the page refreshes
3. **Refresh the browser** - Your changes will appear immediately

## Features

- **Dynamic Loading**: All content is loaded from the YAML file at runtime
- **SEO Friendly**: Meta tags are updated dynamically
- **Responsive**: Works with the existing responsive design
- **Maintainable**: Easy to update content without touching HTML/CSS/JS
- **Extensible**: Easy to add new sections or modify existing ones

## File Structure

```
├── config.yaml              # Main configuration file
├── assets/
│   ├── js/
│   │   ├── config-loader.js  # Configuration loader module
│   │   └── script.js         # Main JavaScript (updated)
│   ├── css/
│   │   └── style.css         # Styles (unchanged)
│   └── images/               # Image assets
├── index.html                # Main HTML file (updated)
└── CONFIG-README.md          # This documentation
```

## Benefits

1. **Easy Content Management**: Update text without touching code
2. **Consistent Structure**: YAML enforces consistent data structure
3. **Version Control Friendly**: Track content changes in Git
4. **Multi-language Support**: Easy to create different config files for different languages
5. **Backup and Restore**: Simple file backup for content

## Future Enhancements

- Add support for markdown in descriptions
- Implement multi-language configuration switching
- Add form validation rules in config
- Support for theme switching via config
- Admin interface for editing config through UI