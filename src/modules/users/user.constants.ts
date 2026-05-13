export const USER_ROLES = {
  USER: 'USER',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export const EXPERTISE_AREAS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Product Management',
  'UI/UX Design',
  'Digital Marketing',
  'Business Strategy',
  'Leadership',
  'Career Development',
  'Interview Prep',
  'Technical Writing',
  'Open Source',
] as const;

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=3B82F6&color=fff';
export const MAX_BIO_LENGTH = 500;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;