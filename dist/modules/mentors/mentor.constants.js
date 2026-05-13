"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENTOR_CATEGORIES = exports.EXPERIENCE_LEVELS = exports.MENTOR_STATUS = exports.MAX_HOURLY_RATE = exports.MIN_HOURLY_RATE = exports.MAX_MENTOR_LIMIT = exports.DEFAULT_MENTOR_LIMIT = exports.MENTOR_SORT_OPTIONS = exports.AVAILABILITY_SLOTS = exports.MENTOR_SKILLS = void 0;
exports.MENTOR_SKILLS = [
    'JavaScript',
    'TypeScript',
    'Python',
    'React',
    'Node.js',
    'Angular',
    'Vue.js',
    'Machine Learning',
    'Data Science',
    'Artificial Intelligence',
    'Product Management',
    'UI/UX Design',
    'DevOps',
    'Cloud Computing',
    'AWS',
    'Azure',
    'Google Cloud',
    'Mobile Development',
    'iOS',
    'Android',
    'Flutter',
    'React Native',
    'Blockchain',
    'Cybersecurity',
    'Career Coaching',
    'Leadership',
    'Communication',
    'Interview Preparation',
    'Resume Review',
    'Digital Marketing',
    'SEO',
    'Data Analytics',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'GraphQL',
    'REST APIs',
    'Docker',
    'Kubernetes',
    'Terraform',
    'CI/CD',
    'Agile',
    'Scrum',
];
exports.AVAILABILITY_SLOTS = [
    'MONDAY_AM',
    'MONDAY_PM',
    'TUESDAY_AM',
    'TUESDAY_PM',
    'WEDNESDAY_AM',
    'WEDNESDAY_PM',
    'THURSDAY_AM',
    'THURSDAY_PM',
    'FRIDAY_AM',
    'FRIDAY_PM',
    'SATURDAY_AM',
    'SATURDAY_PM',
    'SUNDAY_AM',
    'SUNDAY_PM',
];
exports.MENTOR_SORT_OPTIONS = {
    RATING: 'rating',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    EXPERIENCE: 'experience',
    NEWEST: 'newest',
    POPULAR: 'popular',
};
exports.DEFAULT_MENTOR_LIMIT = 10;
exports.MAX_MENTOR_LIMIT = 50;
exports.MIN_HOURLY_RATE = 10;
exports.MAX_HOURLY_RATE = 500;
exports.MENTOR_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended',
};
exports.EXPERIENCE_LEVELS = {
    ENTRY: { min: 0, max: 2, label: 'Entry Level' },
    JUNIOR: { min: 2, max: 4, label: 'Junior' },
    MID: { min: 4, max: 7, label: 'Mid-Level' },
    SENIOR: { min: 7, max: 10, label: 'Senior' },
    EXPERT: { min: 10, max: 50, label: 'Expert' },
};
exports.MENTOR_CATEGORIES = [
    'Technology',
    'Business',
    'Design',
    'Marketing',
    'Finance',
    'Education',
    'Healthcare',
    'Legal',
    'Real Estate',
    'Consulting',
];
//# sourceMappingURL=mentor.constants.js.map