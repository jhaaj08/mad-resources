import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Logout from "../pages/Logout.js";
import Signup from "../pages/Signup.js";
import DashboardStud from "../pages/DashboardStud.js";
import DashboardInst from "../pages/DashboardInst.js";
import Profile from "../pages/Profile.js";
import store from "./store.js";

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/signup', component: Signup },
  { path: '/dashboard', component: DashboardStud, meta: {requiresLogin: true, role: 'stud' } },
  { path: '/dashboard-inst', component: DashboardInst, meta: {requiresLogin: true, role: 'inst' } },
  { path: '/profile', component: Profile },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the route requires login by checking the 'requiresLogin' field in the meta object
  if (to.matched.some(record => record.meta.requiresLogin)) {
    
    // If the user is not logged in, redirect to the login page
    if (!store.state.loggedIn) {
      next({ path: "/login" });
    } 
    // If the user does not have the correct role for the route, redirect to the home page
    else if (to.meta.role && to.meta.role !== store.state.role) {
      next({ path: "/" });
    } 
    // If the user is logged in and has the correct role, proceed as usual
    else {
      next();
    }
  } 
  // If the route does not require authentication, proceed as usual
  else {
    next();
  }
});

export default router;