const usersRoles = [
  {
    role: "admin",
    allows: [
      {
        resource: "/admin/users",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/users/add",
        permissions: "*",
      },
      {
        resource: "/admin/users/edit",
        permissions: "*",
      },
      {
        resource: "/admin/users/edit/:id",
        permissions: "*",
      },
    ],
  },
  {
    role: "user",
    allows: [
      {
        resource: "/dashboard",
        permissions: ["post", "get"],
      },
    ],
  },
  {
    role: "gest",
    allows: [],
  },
];

const permissions = {
  usersRoles: usersRoles,
  addRoleParents: function (targetRole, sourceRole) {
    const targetData = this.usersRoles.find((v) => v.role === targetRole); // np obiekt z rola admin
    const sourceData = this.usersRoles.find((v) => v.role === sourceRole); // np obiekt z rola user

    targetData.allows = targetData.allows.concat(sourceData.allows);
  },
  isResourceAllowedForUser: function (userRole, resource, method) {
    const roleData = this.usersRoles.find((v) => v.role === userRole);

    if (!roleData) return false; // brak dostepu bo nie ma takiej roli obsługwanej na serwerze
    const resourceData = roleData.allows.find((v) => v.resource === resource);
    if (!resourceData) return false; // osoba o tej roli nie ma info o tym adresie wiec nie ma dostepu
    if (!resourceData.permissions) return false; // nie ma dostepu bo nie ma opisanych dozowlonych metod

    if (!Array.isArray(resourceData.permissions)) {
      // gdy nie jest tablicą
      if (resourceData.permissions === "*") return true; // ma dostep do wszystkich metod
      if (resourceData.permissions === method) return true; // ma dostep do konkretnej metody
    } else {
      //gdy jest tablica
      if (resourceData.permissions.find((v) => v === "*")) return true; // ma dostep
      if (resourceData.permissions.find((v) => v === method)) return true; // ma dostep
    }
    return false;
  },
};

permissions.addRoleParents("admin", "user");
console.log(JSON.stringify(permissions.usersRoles, null, 4));
console.log(permissions.isResourceAllowedForUser("admin", "/dashboard", "get"));
console.log(
  permissions.isResourceAllowedForUser("admin", "/dashboard", "delete")
);
console.log(permissions.isResourceAllowedForUser("admin", "/api/users", "get"));
export { permissions };
