export const rolesMapping = {
  hr: "Human Resources",
  "senior-hr": "Senior Human Resources",
  employee: "Employee",
  admin: "Admin",
};

export type Role = keyof typeof rolesMapping;
