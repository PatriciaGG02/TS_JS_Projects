import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import AlumnDataPage from '@/pages/AlumnDataPage.vue';
import AlumnDashboardPage from '@/pages/AlumnDashboardPage.vue';
import CompanyDashboardPage from '@/pages/CompanyDashboardPage.vue';
import CompanyInformationPage from '@/pages/companyInformationPage.vue';
import { useAuth } from '@/composables/useAuth';
import NewPasswordPage from '@/pages/NewPasswordPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/new-password',
    component: NewPasswordPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/alumn/:id',
    component: AlumnDataPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/alumn',
    component: AlumnDashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/company',
    component: CompanyDashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/company/:id',
    component: CompanyInformationPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección global de rutas
router.beforeEach(async (to, from, next) => {
  const { isLoggedIn } = useAuth();
  const logged = await isLoggedIn();

  if (logged && (to.path === '/' || to.path === '/register')) {
    return next('/dashboard/alumn');
  }

  if (to.meta.requiresAuth && !logged) {
    return next('/');
  }

  // Permitir /new-password solo si tiene el access_token en el fragmento de la URL
  if (to.path === '/new-password') {
    const accessToken = to.hash
      .split('#')
      .find((param) => param.startsWith('access_token='));

    if (!accessToken || !logged) {
      return next('/');
    }
  }

  next();
});

export default router;
