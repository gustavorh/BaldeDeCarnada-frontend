// Role utilities for converting between role names and role IDs
export const ROLE_IDS = {
  user: 1,
  manager: 2,
  admin: 3,
} as const;

export const ROLE_NAMES = {
  1: 'user',
  2: 'manager', 
  3: 'admin',
} as const;

export function getRoleId(roleName: string): number {
  const role = roleName.toLowerCase() as keyof typeof ROLE_IDS;
  return ROLE_IDS[role] || ROLE_IDS.user; // Default to user role
}

export function getRoleName(roleId: number): string {
  return ROLE_NAMES[roleId as keyof typeof ROLE_NAMES] || 'user';
}