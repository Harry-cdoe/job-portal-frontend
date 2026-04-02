export type Role = "candidate" | "company" | "admin";

const roleAccess: Record<Role, string[]> = {
  candidate: ["/candidate"],
  company: ["/company"],
  admin: ["/admin", "/candidate", "/company"]
};

export function canAccessPath(role: Role, pathname: string) {
  return roleAccess[role].some((route) => pathname.startsWith(route));
}
