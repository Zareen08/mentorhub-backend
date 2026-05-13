export const MENTOR_SKILLS = [
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
] as const;

export const AVAILABILITY_SLOTS = [
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
] as const;

export const MENTOR_SORT_OPTIONS = {
  RATING: 'rating',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  EXPERIENCE: 'experience',
  NEWEST: 'newest',
  POPULAR: 'popular',
} as const;

export const DEFAULT_MENTOR_LIMIT = 10;
export const MAX_MENTOR_LIMIT = 50;
export const MIN_HOURLY_RATE = 10;
export const MAX_HOURLY_RATE = 500;

export const MENTOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export const EXPERIENCE_LEVELS = {
  ENTRY: { min: 0, max: 2, label: 'Entry Level' },
  JUNIOR: { min: 2, max: 4, label: 'Junior' },
  MID: { min: 4, max: 7, label: 'Mid-Level' },
  SENIOR: { min: 7, max: 10, label: 'Senior' },
  EXPERT: { min: 10, max: 50, label: 'Expert' },
} as const;

export const MENTOR_CATEGORIES = [
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
] as const;