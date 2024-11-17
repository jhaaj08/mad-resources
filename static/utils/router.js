import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Logout from "../pages/Logout.js";
import Signup from "../pages/Signup.js";
import DashboardStud from "../pages/DashboardStud.js"
import DashboardInst from "../pages/DashboardInst.js";
import store from "./store.js";
import Profile from "../pages/Profile.js";


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/logout', component: Logout},
    {path: '/signup', component: Signup},
    {path: '/dashboard', component: DashboardStud},
    {path: '/dashboard-inst', component: DashboardInst},
    {path: '/profile', component: Profile},

];

const router = new VueRouter({
    routes,
    store,
  });
  
export default router;