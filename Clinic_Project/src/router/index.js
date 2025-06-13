import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import SuperadminPage from "@/pages/SuperadminPage.vue";
import Clients from "@/views/Clients.vue";
import Pets from "@/views/Pets.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/services/DatabaseConnection";
import Employees from "@/views/Employees.vue";

import Headquarters from "@/views/Headquarters.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/superadmin",
    name: "SuperAdmin",
    component: SuperadminPage,
    meta: { requiresAuth: true, role: "superadmin" },
  },
  {
    path: "/headquarters",
    name: "Headquarters",
    component: Headquarters,
    meta: { requiresAuth: true, role: ["coordinator", "worker"] },
  },
  {
    path: "/clients/:clientId?", // Agrega un parámetro opcional clientId
    name: "Clients",
    component: Clients,
    meta: { requiresAuth: true, role: ["coordinator", "worker"] },
  },
  {
    path: "/pets",
    name: "Pets",
    component: Pets,
    meta: { requiresAuth: true, role: ["coordinator", "worker"] },
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
    meta: { requiresAuth: true, role: "coordinator" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación y rol
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Verificar si el usuario ya está autenticado
  if (!auth.user) {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      auth.user = data.user;

      // Traer perfil desde la DB si no está cargado
      if (!auth.profile) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        auth.profile = profile;
      }
    }
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!auth.user) {
      console.warn("No autenticado. Redirigiendo a login.");
      return next({ name: "Login" });
    }

    const rol = auth.profile?.rol;

    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role];
    if (to.meta.role && !allowedRoles.includes(rol)) {
      console.warn(
        `Rol no autorizado. Se requiere: ${to.meta.role}, pero el usuario tiene: ${rol}`
      );
      return next({ name: "Login" });
    }
  }

  next();
});

export default router;
