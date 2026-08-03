import ProtectedRoute from "./ProtectedRoute";


export function roleRoute(roles, element) {
  return <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>;
}