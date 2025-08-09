/**
 * AI Upskilling Platform - Core JavaScript
 * Enhanced multi-course progress tracking and platform functionality
 */

class AIUpskillPlatform {
    constructor() {
        this.version = '2.0.0';
        this.storageKey = 'ai-upskill-platform-data';
        this.courses = {
            'ai-for-everyone': {
                name: 'AI for Everyone',
                path: 'courses/ai-for-everyone/',
                status: 'available',
                totalDays: 5
            },
            'ai-for-product-owners': {
                name: 'AI for Product Owners & BAs',
                path: 'courses/ai-for-product-owners/',
                status: 'coming-soon',
                totalDays: 5
            },
            'ai-for-c-suite': {
                name: 'AI for C-Suite Leaders',
                path: 'courses/ai-for-c-suite/',
                status: 'planned',
                totalDays: 5
            },
            'ai-for-engineers': {
                name: 'AI for Software Engineers',
                path: 'courses/ai-for-engineers/',
                status: 'available',
                totalDays: 5
            },
            'ai-for-qa': {
                name: 'AI for QA Engineers',
                path: 'courses/ai-for-qa/',
                status: 'planned',
                totalDays: 5
            }
        };
        
        this.init();
    }

    /**
     * Initialize the platform
     */
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.trackPageView();
        console.log(`AI Upskilling Platform v${this.version} initialized`);
    }

    /**
     * Load user data from localStorage
     */
    loadUserData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.userData = stored ? JSON.parse(stored) : this.getDefaultUserData();
            
            // Migrate old data structure if needed
            this.migrateUserData();
            
            return this.userData;
        } catch (error) {
            console.warn('Error loading user data:', error);
            this.userData = this.getDefaultUserData();
            return this.userData;
        }
    }

    /**
     * Get default user data structure
     */
    getDefaultUserData() {
        return {
            version: this.version,
            userId: this.generateUserId(),
            profile: {
                role: null,
                preferredCourse: null,
                completedCourses: [],
                skillLevel: 'beginner',
                learningGoals: []
            },
            courses: this.initializeCoursesProgress(),
            settings: {
                notifications: true,
                autoSave: true,
                theme: 'light',
                language: 'en'
            },
            analytics: {
                totalTimeSpent: 0,
                sessionsCount: 0,
                lastActiveDate: new Date().toISOString(),
                pageViews: {},
                courseStartDates: {},
                courseCompletionDates: {}
            }
        };
    }

    /**
     * Initialize progress structure for all courses
     */
    initializeCoursesProgress() {
        const coursesProgress = {};
        
        Object.keys(this.courses).forEach(courseId => {
            coursesProgress[courseId] = {
                enrolled: false,
                started: false,
                completed: false,
                currentDay: 0,
                completedDays: [],
                totalTimeSpent: 0,
                lastAccessed: null,
                progress: 0, // 0-100
                days: this.initializeDaysProgress(this.courses[courseId].totalDays),
                assessments: {},
                certificates: [],
                notes: '',
                bookmarks: []
            };
        });
        
        return coursesProgress;
    }

    /**
     * Initialize progress for individual days
     */
    initializeDaysProgress(totalDays) {
        const days = {};
        
        for (let i = 1; i <= totalDays; i++) {
            days[i] = {
                started: false,
                completed: false,
                timeSpent: 0,
                lastAccessed: null,
                activities: {},
                notes: '',
                score: null
            };
        }
        
        return days;
    }

    /**
     * Migrate old data structure to new version
     */
    migrateUserData() {
        if (!this.userData.version || this.userData.version < '2.0.0') {
            console.log('Migrating user data to new format...');
            
            // Migrate old progress structure if it exists
            if (this.userData.progress && this.userData.progress.days) {
                const oldProgress = this.userData.progress;
                
                // Migrate to ai-for-everyone course
                if (!this.userData.courses) {
                    this.userData.courses = this.initializeCoursesProgress();
                }
                
                const everyoneCourse = this.userData.courses['ai-for-everyone'];
                everyoneCourse.enrolled = true;
                everyoneCourse.started = oldProgress.started || false;
                everyoneCourse.completed = oldProgress.completed || false;
                
                // Migrate day progress
                Object.keys(oldProgress.days).forEach(dayNum => {
                    const oldDay = oldProgress.days[dayNum];
                    if (everyoneCourse.days[dayNum]) {
                        everyoneCourse.days[dayNum].started = oldDay.started || false;
                        everyoneCourse.days[dayNum].completed = oldDay.completed || false;
                        everyoneCourse.days[dayNum].timeSpent = oldDay.timeSpent || 0;
                    }
                });
                
                // Calculate progress
                everyoneCourse.progress = this.calculateCourseProgress('ai-for-everyone');
            }
            
            this.userData.version = this.version;
            this.saveUserData();
        }
    }

    /**
     * Save user data to localStorage
     */
    saveUserData() {
        try {
            this.userData.analytics.lastActiveDate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Enroll user in a course
     */
    enrollInCourse(courseId) {
        if (!this.courses[courseId]) {
            console.error(`Course ${courseId} not found`);
            return false;
        }

        const course = this.userData.courses[courseId];
        course.enrolled = true;
        course.enrolledDate = new Date().toISOString();
        
        this.userData.analytics.courseStartDates[courseId] = new Date().toISOString();
        
        this.saveUserData();
        this.trackEvent('course_enrolled', { courseId, courseName: this.courses[courseId].name });
        
        return true;
    }

    /**
     * Start a specific day in a course
     */
    startDay(courseId, dayNumber) {
        if (!this.validateCourseAndDay(courseId, dayNumber)) {
            return false;
        }

        const course = this.userData.courses[courseId];
        const day = course.days[dayNumber];
        
        // Enroll if not already enrolled
        if (!course.enrolled) {
            this.enrollInCourse(courseId);
        }
        
        // Mark course as started
        if (!course.started) {
            course.started = true;
            course.startDate = new Date().toISOString();
        }
        
        // Mark day as started
        if (!day.started) {
            day.started = true;
            day.startDate = new Date().toISOString();
        }
        
        // Update current day
        course.currentDay = Math.max(course.currentDay, dayNumber);
        course.lastAccessed = new Date().toISOString();
        day.lastAccessed = new Date().toISOString();
        
        this.saveUserData();
        this.trackEvent('day_started', { courseId, dayNumber });
        
        return true;
    }

    /**
     * Complete a specific day in a course
     */
    completeDay(courseId, dayNumber, timeSpent = 0, score = null) {
        if (!this.validateCourseAndDay(courseId, dayNumber)) {
            return false;
        }

        const course = this.userData.courses[courseId];
        const day = course.days[dayNumber];
        
        // Mark day as completed
        day.completed = true;
        day.completedDate = new Date().toISOString();
        day.timeSpent += timeSpent;
        if (score !== null) {
            day.score = score;
        }
        
        // Update course progress
        if (!course.completedDays.includes(dayNumber)) {
            course.completedDays.push(dayNumber);
        }
        
        course.totalTimeSpent += timeSpent;
        course.progress = this.calculateCourseProgress(courseId);
        
        // Check if course is completed
        if (course.completedDays.length === this.courses[courseId].totalDays) {
            this.completeCourse(courseId);
        }
        
        this.saveUserData();
        this.trackEvent('day_completed', { courseId, dayNumber, timeSpent, score });
        
        return true;
    }

    /**
     * Complete an entire course
     */
    completeCourse(courseId) {
        if (!this.courses[courseId]) {
            return false;
        }

        const course = this.userData.courses[courseId];
        course.completed = true;
        course.completedDate = new Date().toISOString();
        course.progress = 100;
        
        // Add to completed courses in profile
        if (!this.userData.profile.completedCourses.includes(courseId)) {
            this.userData.profile.completedCourses.push(courseId);
        }
        
        this.userData.analytics.courseCompletionDates[courseId] = new Date().toISOString();
        
        this.saveUserData();
        this.trackEvent('course_completed', { courseId, courseName: this.courses[courseId].name });
        
        // Generate certificate
        this.generateCertificate(courseId);
        
        return true;
    }

    /**
     * Calculate course progress percentage
     */
    calculateCourseProgress(courseId) {
        if (!this.courses[courseId]) {
            return 0;
        }

        const course = this.userData.courses[courseId];
        const totalDays = this.courses[courseId].totalDays;
        const completedDays = course.completedDays.length;
        
        return Math.round((completedDays / totalDays) * 100);
    }

    /**
     * Get course progress summary
     */
    getCourseProgress(courseId) {
        if (!this.courses[courseId]) {
            return null;
        }

        const course = this.userData.courses[courseId];
        const courseInfo = this.courses[courseId];
        
        return {
            courseId,
            name: courseInfo.name,
            status: courseInfo.status,
            enrolled: course.enrolled,
            started: course.started,
            completed: course.completed,
            currentDay: course.currentDay,
            completedDays: course.completedDays.length,
            totalDays: courseInfo.totalDays,
            progress: course.progress,
            timeSpent: course.totalTimeSpent,
            lastAccessed: course.lastAccessed
        };
    }

    /**
     * Get overall platform progress
     */
    getOverallProgress() {
        const availableCourses = Object.keys(this.courses).filter(
            courseId => this.courses[courseId].status === 'available'
        );
        
        let totalProgress = 0;
        let enrolledCourses = 0;
        let completedCourses = 0;
        
        availableCourses.forEach(courseId => {
            const course = this.userData.courses[courseId];
            if (course.enrolled) {
                enrolledCourses++;
                totalProgress += course.progress;
                if (course.completed) {
                    completedCourses++;
                }
            }
        });
        
        const averageProgress = enrolledCourses > 0 ? totalProgress / enrolledCourses : 0;
        
        return {
            enrolledCourses,
            completedCourses,
            averageProgress: Math.round(averageProgress),
            totalAvailableCourses: availableCourses.length,
            totalTimeSpent: this.userData.analytics.totalTimeSpent
        };
    }

    /**
     * Validate course and day parameters
     */
    validateCourseAndDay(courseId, dayNumber) {
        if (!this.courses[courseId]) {
            console.error(`Course ${courseId} not found`);
            return false;
        }
        
        if (dayNumber < 1 || dayNumber > this.courses[courseId].totalDays) {
            console.error(`Invalid day number ${dayNumber} for course ${courseId}`);
            return false;
        }
        
        return true;
    }

    /**
     * Track page views and user activity
     */
    trackPageView(pageName = null) {
        const page = pageName || this.getCurrentPageName();
        
        if (!this.userData.analytics.pageViews[page]) {
            this.userData.analytics.pageViews[page] = 0;
        }
        
        this.userData.analytics.pageViews[page]++;
        this.userData.analytics.sessionsCount++;
        
        this.saveUserData();
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            page: this.getCurrentPageName()
        };
        
        console.log('Event tracked:', event);
        
        // Send to analytics if configured
        if (window.gtag) {
            gtag('event', eventName, data);
        }
        
        // Store locally for debugging
        if (!this.userData.analytics.events) {
            this.userData.analytics.events = [];
        }
        
        this.userData.analytics.events.push(event);
        
        // Keep only last 100 events
        if (this.userData.analytics.events.length > 100) {
            this.userData.analytics.events = this.userData.analytics.events.slice(-100);
        }
        
        this.saveUserData();
    }

    /**
     * Get current page name from URL
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index.html')) {
            return 'home';
        } else if (path.includes('dashboard')) {
            return 'dashboard';
        } else if (path.includes('courses/')) {
            const courseMatch = path.match(/courses\/([^\/]+)/);
            if (courseMatch) {
                const dayMatch = path.match(/day(\d+)/);
                return dayMatch ? `${courseMatch[1]}-day${dayMatch[1]}` : `${courseMatch[1]}-overview`;
            }
        } else if (path.includes('platform/')) {
            const pageMatch = path.match(/platform\/([^\/]+)/);
            return pageMatch ? pageMatch[1] : 'platform';
        }
        
        return 'unknown';
    }

    /**
     * Generate course completion certificate
     */
    generateCertificate(courseId) {
        const course = this.userData.courses[courseId];
        const courseInfo = this.courses[courseId];
        
        const certificate = {
            id: this.generateCertificateId(),
            courseId,
            courseName: courseInfo.name,
            completedDate: course.completedDate,
            timeSpent: course.totalTimeSpent,
            score: this.calculateAverageScore(courseId),
            validationCode: this.generateValidationCode()
        };
        
        course.certificates.push(certificate);
        this.saveUserData();
        
        return certificate;
    }

    /**
     * Generate certificate ID
     */
    generateCertificateId() {
        return 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate validation code for certificate
     */
    generateValidationCode() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    /**
     * Calculate average score for a course
     */
    calculateAverageScore(courseId) {
        const course = this.userData.courses[courseId];
        const scores = [];
        
        Object.values(course.days).forEach(day => {
            if (day.score !== null) {
                scores.push(day.score);
            }
        });
        
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    }

    /**
     * Export user data for backup
     */
    exportUserData() {
        return {
            exportDate: new Date().toISOString(),
            version: this.version,
            userData: this.userData
        };
    }

    /**
     * Import user data from backup
     */
    importUserData(exportedData) {
        try {
            if (exportedData.userData && exportedData.version) {
                this.userData = exportedData.userData;
                this.migrateUserData();
                this.saveUserData();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing user data:', error);
            return false;
        }
    }

    /**
     * Reset all user data
     */
    resetUserData() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.userData = this.getDefaultUserData();
            this.saveUserData();
            location.reload();
        }
    }

    /**
     * Setup event listeners for platform interactions
     */
    setupEventListeners() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .course-card, .day-card')) {
                this.trackEvent('element_clicked', {
                    element: e.target.className,
                    text: e.target.textContent?.trim().substring(0, 50)
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submitted', {
                form: e.target.className,
                page: this.getCurrentPageName()
            });
        });

        // Track time spent on page
        this.startTimeTracking();
    }

    /**
     * Start tracking time spent on current page
     */
    startTimeTracking() {
        this.pageStartTime = Date.now();
        
        // Save time when user leaves page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.pageStartTime;
            this.userData.analytics.totalTimeSpent += timeSpent;
            this.saveUserData();
        });
        
        // Save time periodically (every 30 seconds)
        setInterval(() => {
            const timeSpent = Date.now() - this.pageStartTime;
            this.userData.analytics.totalTimeSpent += timeSpent;
            this.pageStartTime = Date.now();
            this.saveUserData();
        }, 30000);
    }
}

// Initialize platform when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make platform globally available
    window.aiUpskillPlatform = new AIUpskillPlatform();
    
    // Legacy compatibility
    window.courseTracker = {
        loadUserData: () => window.aiUpskillPlatform.loadUserData(),
        startDay: (day, course) => window.aiUpskillPlatform.startDay(course || 'ai-for-everyone', day),
        completeDay: (day, timeSpent, course) => window.aiUpskillPlatform.completeDay(course || 'ai-for-everyone', day, timeSpent),
        trackPageView: (page) => window.aiUpskillPlatform.trackPageView(page)
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIUpskillPlatform;
}
