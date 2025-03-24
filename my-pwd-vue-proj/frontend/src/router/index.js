import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/login.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Database from '@/pages/Database.vue';
import Create from '@/pages/Create.vue';
import Calendar from '@/pages/Calendar.vue';

const routes = [
  { path: '/', name: 'Login', component: Login }, // ✅ Set Login as the default route
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/database', name: 'Database', component: Database },
  { path: '/create', name: 'Create', component: Create },
  { path: '/calendar', name: 'Calendar', component: Calendar },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // ✅ Fix Vite compatibility
  routes,
});


// ✅ Global navigation guard to protect routes
  router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  if (to.path !== '/' && !isAuthenticated) {
    next('/'); // ✅ Redirect to login if not authenticated
  } else {
    next(); // ✅ Allow navigation
  }
});

export default router;
