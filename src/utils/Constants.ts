export const UserRolesEnum = {
  ADMIN: "admin",
  USER: "user",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

export const PostStatusType = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const AvailablePostStatuses = Object.values(PostStatusType);

export const PostApprovalType = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const AvailablePostApprovalStatuses = Object.values(PostApprovalType);
