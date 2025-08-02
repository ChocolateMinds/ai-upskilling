/**
 * AI Literacy Course Progress Tracker
 * Manages user progress, achievements, and course completion
 */

class CourseProgressTracker {
    constructor() {
        this.storageKey = 'ai-course-progress';
        this.userData = this.loadUserData();
        this.initializeEventListeners();
    }

    /**
     * Initialize default user data structure
     */
    getDefaultUserData() {
        return {
            userId: this.generateUserId(),
            startDate: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            profile: {
                name: '',
                email: '',
                department: '',
                role: '',
                experience: 'beginner', // beginner, intermediate, advanced
                goals: []
            },
            progress: {
                currentDay: 1,
                completedDays: [],
                totalTimeSpent: 0, // in minutes
                coursePace: 'on-track' // ahead, on-track, behind
            },
            daily: {
                day1: this.getDefaultDayData(),
                day2: this.getDefaultDayData(),
                day3: this.getDefaultDayData(),
                day4: this.getDefaultDayData(),
                day5: this.getDefaultDayData()
            },
            achievements: [],
            certificates: [],
            settings: {
                notifications: true,
                theme: 'light',
                autoSave: true
            },
            analytics: {
                pageViews: {},
                timeOnPage: {},
                interactions: [],
                completionRate: 0
            }
        };
    }

    /**
     * Get default data structure for each day
     */
    getDefaultDayData() {
        return {
            status: 'not-started', // not-started, in-progress, completed
            startTime: null,
            completionTime: null,
            timeSpent: 0, // in minutes
            score: 0,
            activities: {
                videosWatched: [],
                exercisesCompleted: [],
                assignmentSubmitted: false,
                checklistItems: []
            },
            notes: '',
            reflection: '',
            confidence: 0, // 1-5 scale
            feedback: ''
        };
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Load user data from localStorage
     */
    loadUserData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                // Merge with default structure to handle version updates
                return this.mergeWithDefaults(data);
            }
        } catch (error) {
            console.warn('Error loading user data:', error);
        }
        return this.getDefaultUserData();
    }

    /**
     * Merge stored data with default structure
     */
    mergeWithDefaults(stored) {
        const defaults = this.getDefaultUserData();
        return this.deepMerge(defaults, stored);
    }

    /**
     * Deep merge two objects
     */
    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = target[key] || {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    /**
     * Save user data to localStorage
     */
    saveUserData() {
        try {
            this.userData.lastAccessed = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
            this.triggerEvent('dataSaved', this.userData);
        } catch (error) {
            console.error('Error saving user data:', error);
            this.triggerEvent('saveError', error);
        }
    }

    /**
     * Update user profile information
     */
    updateProfile(profileData) {
        Object.assign(this.userData.profile, profileData);
        this.saveUserData();
        this.triggerEvent('profileUpdated', this.userData.profile);
    }

    /**
     * Start a day's activities
     */
    startDay(dayNumber) {
        const dayKey = `day${dayNumber}`;
        const dayData = this.userData.daily[dayKey];
        
        if (dayData.status === 'not-started') {
            dayData.status = 'in-progress';
            dayData.startTime = new Date().toISOString();
            this.userData.progress.currentDay = Math.max(this.userData.progress.currentDay, dayNumber);
        }
        
        this.saveUserData();
        this.triggerEvent('dayStarted', { day: dayNumber, data: dayData });
    }

    /**
     * Complete a day's activities
     */
    completeDay(dayNumber, completionData = {}) {
        const dayKey = `day${dayNumber}`;
        const dayData = this.userData.daily[dayKey];
        
        dayData.status = 'completed';
        dayData.completionTime = new Date().toISOString();
        
        // Update completion data
        if (completionData.score !== undefined) dayData.score = completionData.score;
        if (completionData.confidence !== undefined) dayData.confidence = completionData.confidence;
        if (completionData.reflection) dayData.reflection = completionData.reflection;
        if (completionData.feedback) dayData.feedback = completionData.feedback;
        
        // Add to completed days if not already there
        if (!this.userData.progress.completedDays.includes(dayNumber)) {
            this.userData.progress.completedDays.push(dayNumber);
        }
        
        // Check for achievements
        this.checkAchievements(dayNumber);
        
        // Update course pace
        this.updateCoursePace();
        
        this.saveUserData();
        this.triggerEvent('dayCompleted', { day: dayNumber, data: dayData });
        
        // Check if course is completed
        if (this.userData.progress.completedDays.length === 5) {
            this.completeCourse();
        }
    }

    /**
     * Record activity completion
     */
    recordActivity(dayNumber, activityType, activityId, data = {}) {
        const dayKey = `day${dayNumber}`;
        const dayData = this.userData.daily[dayKey];
        
        // Ensure day is started
        if (dayData.status === 'not-started') {
            this.startDay(dayNumber);
        }
        
        // Record the activity
        switch (activityType) {
            case 'video':
                if (!dayData.activities.videosWatched.includes(activityId)) {
                    dayData.activities.videosWatched.push(activityId);
                }
                break;
            case 'exercise':
                if (!dayData.activities.exercisesCompleted.includes(activityId)) {
                    dayData.activities.exercisesCompleted.push(activityId);
                }
                break;
            case 'assignment':
                dayData.activities.assignmentSubmitted = true;
                if (data.submissionData) {
                    dayData.assignmentData = data.submissionData;
                }
                break;
            case 'checklist':
                if (!dayData.activities.checklistItems.includes(activityId)) {
                    dayData.activities.checklistItems.push(activityId);
                }
                break;
        }
        
        // Track time
        if (data.timeSpent) {
            dayData.timeSpent += data.timeSpent;
            this.userData.progress.totalTimeSpent += data.timeSpent;
        }
        
        this.saveUserData();
        this.triggerEvent('activityCompleted', {
            day: dayNumber,
            type: activityType,
            id: activityId,
            data: data
        });
    }

    /**
     * Update course pace based on completion
     */
    updateCoursePace() {
        const today = new Date();
        const startDate = new Date(this.userData.startDate);
        const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const expectedDays = Math.min(daysSinceStart + 1, 5);
        const completedDays = this.userData.progress.completedDays.length;
        
        if (completedDays >= expectedDays) {
            this.userData.progress.coursePace = completedDays > expectedDays ? 'ahead' : 'on-track';
        } else {
            this.userData.progress.coursePace = 'behind';
        }
    }

    /**
     * Check and award achievements
     */
    checkAchievements(dayNumber) {
        const achievements = [];
        
        // Day completion achievements
        if (dayNumber === 1 && !this.hasAchievement('first-day')) {
            achievements.push({
                id: 'first-day',
                title: 'AI Journey Begins',
                description: 'Completed your first day of AI learning',
                icon: '🚀',
                earnedDate: new Date().toISOString()
            });
        }
        
        if (dayNumber === 5 && !this.hasAchievement('course-graduate')) {
            achievements.push({
                id: 'course-graduate',
                title: 'AI Literacy Graduate',
                description: 'Completed the entire 5-day AI literacy course',
                icon: '🎓',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Streak achievements
        const streak = this.getCompletionStreak();
        if (streak >= 3 && !this.hasAchievement('three-day-streak')) {
            achievements.push({
                id: 'three-day-streak',
                title: 'Consistency Champion',
                description: 'Completed 3 days in a row',
                icon: '🔥',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Time-based achievements
        const dayData = this.userData.daily[`day${dayNumber}`];
        if (dayData.timeSpent >= 120 && !this.hasAchievement('dedicated-learner')) { // 2+ hours
            achievements.push({
                id: 'dedicated-learner',
                title: 'Dedicated Learner',
                description: 'Spent over 2 hours learning in a single day',
                icon: '⏰',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Perfect score achievement
        if (dayData.score === 100 && !this.hasAchievement('perfect-score')) {
            achievements.push({
                id: 'perfect-score',
                title: 'Perfect Score',
                description: 'Achieved a perfect score on a daily assessment',
                icon: '💯',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Add achievements to user data
        achievements.forEach(achievement => {
            this.userData.achievements.push(achievement);
            this.triggerEvent('achievementEarned', achievement);
        });
    }

    /**
     * Check if user has specific achievement
     */
    hasAchievement(achievementId) {
        return this.userData.achievements.some(a => a.id === achievementId);
    }

    /**
     * Get completion streak
     */
    getCompletionStreak() {
        const completedDays = this.userData.progress.completedDays.sort();
        let streak = 0;
        let expectedDay = 1;
        
        for (const day of completedDays) {
            if (day === expectedDay) {
                streak++;
                expectedDay++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    /**
     * Complete the entire course
     */
    completeCourse() {
        const completionData = {
            completedAt: new Date().toISOString(),
            totalTimeSpent: this.userData.progress.totalTimeSpent,
            averageScore: this.getAverageScore(),
            completionRate: 100
        };
        
        // Generate certificate
        const certificate = this.generateCertificate(completionData);
        this.userData.certificates.push(certificate);
        
        // Award final achievement
        if (!this.hasAchievement('course-graduate')) {
            this.checkAchievements(5);
        }
        
        this.userData.analytics.completionRate = 100;
        this.saveUserData();
        this.triggerEvent('courseCompleted', completionData);
    }

    /**
     * Generate completion certificate
     */
    generateCertificate(completionData) {
        return {
            id: 'certificate_' + Date.now(),
            type: 'course-completion',
            title: '5-Day AI Literacy Course Completion',
            recipientName: this.userData.profile.name || 'Course Participant',
            issuedDate: completionData.completedAt,
            validationCode: this.generateValidationCode(),
            details: {
                courseDuration: '5 days',
                totalHours: Math.round(completionData.totalTimeSpent / 60 * 10) / 10,
                averageScore: completionData.averageScore,
                issuer: 'AI Literacy Course Program'
            }
        };
    }

    /**
     * Generate certificate validation code
     */
    generateValidationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Get average score across all completed days
     */
    getAverageScore() {
        const completedDays = this.userData.progress.completedDays;
        if (completedDays.length === 0) return 0;
        
        const totalScore = completedDays.reduce((sum, day) => {
            return sum + (this.userData.daily[`day${day}`].score || 0);
        }, 0);
        
        return Math.round(totalScore / completedDays.length);
    }

    /**
     * Get overall progress percentage
     */
    getProgressPercentage() {
        return (this.userData.progress.completedDays.length / 5) * 100;
    }

    /**
     * Get detailed progress report
     */
    getProgressReport() {
        return {
            overall: {
                percentage: this.getProgressPercentage(),
                completedDays: this.userData.progress.completedDays.length,
                totalDays: 5,
                currentDay: this.userData.progress.currentDay,
                pace: this.userData.progress.coursePace,
                totalTimeSpent: this.userData.progress.totalTimeSpent
            },
            daily: Object.keys(this.userData.daily).map(dayKey => {
                const dayNumber = parseInt(dayKey.replace('day', ''));
                const dayData = this.userData.daily[dayKey];
                return {
                    day: dayNumber,
                    status: dayData.status,
                    score: dayData.score,
                    timeSpent: dayData.timeSpent,
                    confidence: dayData.confidence,
                    activitiesCompleted: this.countDayActivities(dayData)
                };
            }),
            achievements: this.userData.achievements,
            certificates: this.userData.certificates
        };
    }

    /**
     * Count completed activities for a day
     */
    countDayActivities(dayData) {
        const activities = dayData.activities;
        return {
            videos: activities.videosWatched.length,
            exercises: activities.exercisesCompleted.length,
            assignment: activities.assignmentSubmitted ? 1 : 0,
            checklist: activities.checklistItems.length
        };
    }

    /**
     * Track page analytics
     */
    trackPageView(page) {
        const timestamp = new Date().toISOString();
        this.userData.analytics.pageViews[page] = this.userData.analytics.pageViews[page] || [];
        this.userData.analytics.pageViews[page].push(timestamp);
        this.saveUserData();
    }

    /**
     * Track time spent on page
     */
    trackTimeOnPage(page, timeSpent) {
        this.userData.analytics.timeOnPage[page] = this.userData.analytics.timeOnPage[page] || 0;
        this.userData.analytics.timeOnPage[page] += timeSpent;
        this.saveUserData();
    }

    /**
     * Track user interactions
     */
    trackInteraction(type, data) {
        this.userData.analytics.interactions.push({
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        });
        this.saveUserData();
    }

    /**
     * Export user data
     */
    exportData() {
        return {
            exportDate: new Date().toISOString(),
            version: '1.0',
            userData: this.userData
        };
    }

    /**
     * Import user data
     */
    importData(exportedData) {
        try {
            if (exportedData.userData) {
                this.userData = this.mergeWithDefaults(exportedData.userData);
                this.saveUserData();
                this.triggerEvent('dataImported', this.userData);
                return true;
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.triggerEvent('importError', error);
        }
        return false;
    }

    /**
     * Reset user progress
     */
    resetProgress(confirmCode) {
        if (confirmCode === 'RESET_ALL_PROGRESS') {
            localStorage.removeItem(this.storageKey);
            this.userData = this.getDefaultUserData();
            this.triggerEvent('progressReset', {});
            return true;
        }
        return false;
    }

    /**
     * Initialize event listeners for automatic tracking
     */
    initializeEventListeners() {
        // Track page visibility changes for time tracking
        let startTime = Date.now();
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
                if (timeSpent > 0) {
                    this.trackTimeOnPage(window.location.pathname, timeSpent);
                }
            } else {
                startTime = Date.now();
            }
        });
        
        // Track page load
        window.addEventListener('load', () => {
            this.trackPageView(window.location.pathname);
        });
        
        // Auto-save on beforeunload
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
            if (timeSpent > 0) {
                this.trackTimeOnPage(window.location.pathname, timeSpent);
            }
        });
    }

    /**
     * Custom event system
     */
    on(eventType, callback) {
        if (!this.eventListeners) this.eventListeners = {};
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(callback);
    }

    /**
     * Trigger custom events
     */
    triggerEvent(eventType, data) {
        if (!this.eventListeners) return;
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event callback:', error);
                }
            });
        }
    }
}

// Initialize global progress tracker
window.courseTracker = new CourseProgressTracker();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseProgressTracker;
} 