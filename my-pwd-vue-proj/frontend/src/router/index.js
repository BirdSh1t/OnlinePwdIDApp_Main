import { createRouter, createWebHistory } from 'vue-router';

// 🔹 Import Pages
//import login from '@/pages/login.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Database from '@/pages/Database.vue';
import Create from '@/pages/Create.vue';
import Calendar from '@/pages/Calendar.vue';
import Archive from '@/pages/Archive.vue';
import LandingPage from '@/pages/LandingPage.vue';

// 🔹 Import Layouts
import AdminLayout from '@/layouts/AdminLayout.vue';
import PWDLayout from '@/layouts/PWDLayout.vue';

// 🔹 Import PWD Applicant Page
import Home from '@/pages/pwd_applicants_page/Home_pg.vue';

const routes = [
  // ✅ Login Route (No Layout)
  { 
    path: '/', 
    name: 'LandingPage', 
    component: LandingPage
  },


  { 
    path: '/admin', 
    component: AdminLayout, 
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard }, 
      { path: 'database', name: 'Database', component: Database }, 
      { path: 'create', name: 'Create', component: Create },
      { path: 'calendar', name: 'Calendar', component: Calendar },
      { path: 'archive', name: 'Archive', component: Archive }
    ],
    meta: { requiresAuth: true }
  },

  // ✅ PWD Applicant Routes (Wrapped in PWDLayout)
  // http://localhost:5173/pwd/home
  { 
    path: '/pwd', 
    component: PWDLayout, 
    children: [
      { path: 'home', name: 'Home', component: Home },
    ]
  }
];

// ✅ Create and export the router properly
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
