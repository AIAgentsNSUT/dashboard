export const rolesMapping: { [key in UserRole]: string } = {
  hr: "Human Resources",
  "senior-hr": "Senior Human Resources",
  employee: "Employee",
  admin: "Admin",
};

export const outputTypes: OutputType[] = ["file", "json", "string"];
export const fileTypes: FileType[] = ["image", "pdf", "doc", "mp4", "mp3"];
export const agentStates: AgentState[] = [
  "error",
  "idle",
  "pending_approval",
  "running",
  "success",
];
export const notificationTypes: NotificationType[] = [
  "collaboration",
  "approval",
  "input_required",
  "tag",
];

export const notificationStatus: NotificationStatus[] = ["unread", "read"];
