import { createRouter, createWebHistory } from 'vue-router'
import { apiClient } from '@/api/apiClient'

// Layouts
import AdminLayout        from '@/layouts/AdminLayout.vue'
import PWDLayout          from '@/layouts/PWDLayout.vue'

// Admin/Employee Views
import Dashboard          from '@/pages/Dashboard.vue'
import Database           from '@/pages/Database.vue'
import Create             from '@/pages/Create.vue'
import PendingApplicants  from '@/pages/PendingApplicants.vue'
import Archive            from '@/pages/Archive.vue'

// PWD-Applicant Views
import Home               from '@/pages/pwd_applicants_page/Home_pg.vue'
import GetToKnowUs        from '@/pages/pwd_applicants_page/GetToKnowUs_pg.vue'
import Applications       from '@/pages/pwd_applicants_page/Applications_pg.vue'
import Benefits           from '@/pages/pwd_applicants_page/Benefits_pg.vue'
import ContactUs          from '@/pages/pwd_applicants_page/ContactUs_pg.vue'
import Guidelines         from '@/pages/pwd_applicants_page/Guidelines_pg.vue'
import DataPrivacy        from '@/pages/pwd_applicants_page/RA_10173.vue'

// Landing / Public
import LandingPage        from '@/pages/LandingPage.vue'


const routes = [
  // ✅ Default landing page
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },

  // ✅ Admin & Employee Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'employee'] },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'database', name: 'Database', component: Database },
      { path: 'create', name: 'Create', component: Create },
      { path: 'pendingApp', name: 'PendingApplicants', component: PendingApplicants },
      { path: 'archive', name: 'Archive', component: Archive }
    ],
  },

  // Employee-only (same chrome!)
{
  path: '/employee',
  component: AdminLayout,
  meta: { requiresAuth: true, allowedRoles: ['employee'] },
  children: [
    { path: 'dashboard', name: 'EmployeeDashboard', component: Dashboard },
    { path: 'database', name: 'EmployeeDatabase', component: Database },
    { path: 'create', name: 'EmployeeCreate', component: Create },
    { path: 'pendingApp', name: 'EmployeePending', component: PendingApplicants },
    { path: 'archive', name: 'EmployeeArchive', component: Archive }
  ]
},

  // ✅ PWD Applicant Routes
  {
    path: '/pwd',
    component: PWDLayout,
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'GetToKnowUs', name: 'GetToKnowUs', component: GetToKnowUs },
      { path: 'applications', name: 'Applications', component: Applications },
      { path: 'benefits', name: 'Benefits', component: Benefits },
      { path: 'contact-us', name: 'ContactUs', component: ContactUs },
      { path: 'guidelines', name: 'Guidelines', component: Guidelines },
      { path: 'dataprivacy', name: 'DataPrivacy', component: DataPrivacy }
    ]
  }
]

// ✅ Create router after defining routes
const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Add global auth/role guard
router.beforeEach(async (to, from, next) => {
  // 1. Skip auth check if not required
  if (!to.meta.requiresAuth) {
    return next()
  }

  try {
    // 2. Get current user role from secure API
    const res = await apiClient.get('/api/secure/auth/verify-role')
    const userRole = res.data?.role

    // 3. Block if no role is returned
    if (!userRole) {
      console.error('No role found in verify-role response.')
      return next({ name: 'LandingPage' })
    }

    // 4. Check if route allows that role
    const allowedRoles = to.meta.allowedRoles || []

    if (!allowedRoles.includes(userRole)) {
      console.warn(`Blocked: Role "${userRole}" not allowed on this route.`)
      return next({ name: 'LandingPage' })
    }

    // 5. All good
    return next()
  } catch (err) {
    console.error('Role verification failed:', err)
    return next({ name: 'LandingPage' })
  }
})

export default router


  // { path: '/', name: 'LandingPage', component: LandingPage },

  // // Combined Admin & Employee under /app
  // {
  //   path: '/app',
  //   component: AdminLayout,
  //   meta: { requiresAuth: true },
  //   children: [
  //     { 
  //       path: 'dashboard', 
  //       name: 'Dashboard', 
  //       component: Dashboard, 
  //       meta: { allowedRoles: ['admin','employee'] } 
  //     },
  //     { 
  //       path: 'database', 
  //       name: 'Database', 
  //       component: Database, 
  //       meta: { allowedRoles: ['admin','employee'] } 
  //     },
  //     { 
  //       path: 'create', 
  //       name: 'Create', 
  //       component: Create, 
  //       meta: { allowedRoles: ['admin','employee'] } 
  //     },
  //     { 
  //       path: 'pending', 
  //       name: 'PendingApplicants', 
  //       component: PendingApplicants, 
  //       meta: { allowedRoles: ['admin','employee'] } 
  //     },
  //     { 
  //       path: 'archive', 
  //       name: 'Archive', 
  //       component: Archive, 
  //       meta: { allowedRoles: ['admin'] } 
  //     },
  //     // Redirect bare /app → dashboard
  //     { path: '', redirect: { name: 'Dashboard' } }
  //   ]
  // },