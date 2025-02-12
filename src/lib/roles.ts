export const rolesMapping = {
  hr: "Human Resources",
  "senior-hr": "Senior Human Resources",
  employee: "Employee",
};

export type Role = keyof typeof rolesMapping;
