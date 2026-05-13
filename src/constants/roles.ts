export const ROLES = {
  USER: 'USER',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.MENTOR]: 2,
  [ROLES.ADMIN]: 3,
};

export const PERMISSIONS = {
  [ROLES.USER]: ['read:profile', 'update:profile', 'create:booking', 'read:mentors'],
  [ROLES.MENTOR]: ['read:profile', 'update:profile', 'create:booking', 'read:mentors', 'manage:bookings', 'manage:availability'],
  [ROLES.ADMIN]: ['*'],
};