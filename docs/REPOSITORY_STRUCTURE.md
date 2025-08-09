# AI Upskilling Platform - Repository Structure

This document outlines the recommended directory structure for the AI Upskilling Platform.

## 🏗️ **Complete Directory Structure**

```
ai-upskilling/
├── README.md                          # Platform overview and documentation
├── index.html                         # Main landing page (course selection)
├── LICENSE                           # MIT License file
├── CONTRIBUTING.md                   # Contribution guidelines
├── 
├── courses/                          # Individual course modules
│   ├── ai-for-everyone/             # General AI literacy course
│   │   ├── index.html               # Course overview page
│   │   ├── day1.html                # Day 1 content
│   │   ├── day2.html                # Day 2 content
│   │   ├── day3.html                # Day 3 content
│   │   ├── day4.html                # Day 4 content
│   │   ├── day5.html                # Day 5 content
│   │   ├── assets/                  # Course-specific assets
│   │   │   ├── images/              # Course images
│   │   │   ├── videos/              # Course videos
│   │   │   └── downloads/           # Downloadable resources
│   │   └── README.md                # Course-specific documentation
│   │
│   ├── ai-for-product-owners/       # Product Owner & BA course
│   │   ├── index.html               # Course overview
│   │   ├── day1.html                # Foundation & Product Strategy
│   │   ├── day2.html                # AI-Enhanced User Research
│   │   ├── day3.html                # Competitive Intelligence
│   │   ├── day4.html                # Data-Driven Decisions
│   │   ├── day5.html                # Roadmap Planning & Strategy
│   │   ├── assets/
│   │   └── README.md
│   │
│   ├── ai-for-c-suite/              # Executive leadership course
│   │   ├── index.html               # Course overview
│   │   ├── day1.html                # AI Strategy & Vision
│   │   ├── day2.html                # Investment & ROI Planning
│   │   ├── day3.html                # Governance & Risk Management
│   │   ├── day4.html                # Organizational Change
│   │   ├── day5.html                # Future Planning & Leadership
│   │   ├── assets/
│   │   └── README.md
│   │
│   ├── ai-for-engineers/            # Software engineering course
│   │   ├── index.html               # Course overview
│   │   ├── day1.html                # AI Fundamentals for Developers
│   │   ├── day2.html                # Prompt Engineering for Code
│   │   ├── day3.html                # AI Coding Assistants
│   │   ├── day4.html                # Code Review & Testing
│   │   ├── day5.html                # Advanced AI Development
│   │   ├── assets/
│   │   └── README.md
│   │
│   └── ai-for-qa/                   # QA engineering course
│       ├── index.html               # Course overview
│       ├── day1.html                # AI in Quality Assurance
│       ├── day2.html                # Automated Testing with AI
│       ├── day3.html                # Intelligent Bug Detection
│       ├── day4.html                # Performance & Load Testing
│       ├── day5.html                # Future of AI in QA
│       ├── assets/
│       └── README.md
│
├── shared/                          # Shared platform components
│   ├── css/                         # Shared stylesheets
│   │   ├── platform-styles.css     # Main platform styles
│   │   ├── course-common.css       # Common course styles
│   │   ├── components.css          # Reusable UI components
│   │   └── themes/                 # Color themes for different courses
│   │       ├── product-owner.css   # PO-specific theme
│   │       ├── engineering.css     # Engineering theme
│   │       └── executive.css       # C-suite theme
│   │
│   ├── js/                          # Shared JavaScript
│   │   ├── platform-core.js        # Core platform functionality
│   │   ├── progress-tracker.js     # Progress tracking system
│   │   ├── analytics.js            # Analytics and tracking
│   │   ├── components/              # Reusable JS components
│   │   │   ├── course-navigator.js # Course navigation
│   │   │   ├── progress-bar.js     # Progress indicators
│   │   │   └── assessment.js       # Assessment tools
│   │   └── utils/                   # Utility functions
│   │       ├── storage.js          # Local storage management
│   │       └── validation.js       # Form validation
│   │
│   ├── assets/                      # Shared media assets
│   │   ├── images/                 # Platform logos, icons
│   │   │   ├── logo.svg            # Main platform logo
│   │   │   ├── favicon.ico         # Favicon
│   │   │   ├── course-icons/       # Course-specific icons
│   │   │   └── ui-icons/           # UI element icons
│   │   ├── fonts/                  # Custom fonts (if needed)
│   │   └── videos/                 # Shared promotional videos
│   │
│   └── components/                  # Reusable HTML components
│       ├── header.html             # Platform header
│       ├── footer.html             # Platform footer
│       ├── course-card.html        # Course selection card
│       └── navigation.html         # Course navigation
│
├── platform/                       # Platform-level pages
│   ├── dashboard/                  # User dashboard
│   │   ├── index.html              # Main dashboard
│   │   ├── progress.html           # Progress overview
│   │   ├── certificates.html      # Certificates view
│   │   └── settings.html           # User settings
│   │
│   ├── about/                      # About the platform
│   │   ├── index.html              # About page
│   │   ├── team.html               # Team information
│   │   └── methodology.html        # Learning methodology
│   │
│   ├── compare-courses/            # Course comparison
│   │   └── index.html              # Course comparison tool
│   │
│   └── help/                       # Help and support
│       ├── index.html              # Help center
│       ├── faq.html                # Frequently asked questions
│       └── contact.html            # Contact information
│
├── docs/                           # Documentation
│   ├── platform-architecture.md   # Technical architecture
│   ├── course-development.md       # Guide for creating new courses
│   ├── deployment-guide.md         # Deployment instructions
│   ├── api-documentation.md        # API documentation
│   ├── analytics-guide.md          # Analytics implementation
│   └── troubleshooting.md          # Common issues and solutions
│
├── tools/                          # Development tools
│   ├── course-generator/           # Scripts to create new courses
│   ├── content-validator/          # Content validation tools
│   └── deployment/                 # Deployment scripts
│
└── .github/                        # GitHub-specific files
    ├── workflows/                  # GitHub Actions
    │   ├── deploy.yml              # Deployment workflow
    │   └── tests.yml               # Testing workflow
    ├── ISSUE_TEMPLATE/             # Issue templates
    └── pull_request_template.md    # PR template
```

## 📂 **Key Directory Purposes**

### **courses/**
- Each course is completely self-contained
- Independent navigation and content
- Course-specific assets and resources
- Standardized 5-day structure

### **shared/**
- Common platform components
- Consistent styling across courses
- Shared JavaScript functionality
- Reusable UI elements

### **platform/**
- Platform-level functionality
- User dashboard and progress tracking
- Course comparison and selection
- Help and support resources

### **docs/**
- Technical documentation
- Development guides
- Deployment instructions
- API documentation

## 🔗 **File Relationships**

### **Main Landing Page**
- `index.html` → Course selection portal
- Links to individual course overview pages
- Includes shared platform styles and scripts

### **Course Structure**
- Each course has identical file structure
- `courses/{course-name}/index.html` → Course overview
- `courses/{course-name}/day{1-5}.html` → Daily content
- Independent but consistent styling

### **Shared Components**
- `shared/css/platform-styles.css` → Used by all pages
- `shared/js/platform-core.js` → Progress tracking across courses
- Course-specific themes in `shared/css/themes/`

## 🎨 **Styling Strategy**

### **CSS Architecture**
```
Platform Base Styles (platform-styles.css)
├── Course Common Styles (course-common.css)
├── Component Styles (components.css)
└── Course-Specific Themes
    ├── Product Owner Theme
    ├── Engineering Theme
    └── Executive Theme
```

### **Theme System**
- Base platform styles for consistency
- Course-specific color schemes and branding
- Role-appropriate visual design
- Consistent component behavior

## 📊 **Data Management**

### **Progress Tracking**
- Multi-course progress in localStorage
- Course-specific completion tracking
- Cross-course analytics and insights
- Certificate generation system

### **User Data Structure**
```javascript
{
  profile: { role, preferences, goals },
  courses: {
    'ai-for-everyone': { progress, completion, certificates },
    'ai-for-product-owners': { progress, completion, certificates },
    // ... other courses
  },
  analytics: { time_spent, page_views, events }
}
```

## 🚀 **Deployment Strategy**

### **GitHub Pages Setup**
- Root `index.html` as main landing page
- All courses accessible via relative paths
- Shared assets properly referenced
- SEO-optimized structure

### **URL Structure**
```
https://chocolateminds.github.io/ai-upskilling/
├── /                               # Landing page
├── /courses/ai-for-everyone/       # General course
├── /courses/ai-for-product-owners/ # PO course
├── /platform/dashboard/            # User dashboard
└── /platform/about/                # About page
```

This structure ensures:
- ✅ **Scalability**: Easy to add new courses
- ✅ **Independence**: Courses don't interfere with each other
- ✅ **Consistency**: Shared components and styling
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **SEO-Friendly**: Logical URL structure
- ✅ **Performance**: Efficient asset loading
