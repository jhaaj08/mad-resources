import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Logout from "../pages/Logout.js";
import Signup from "../pages/Signup.js";
import DashboardStud from "../pages/DashboardStud.js"
import store from "./store.js";


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/logout', component: Logout},
    {path: '/signup', component: Signup},
    {path: '/dashboard', component: DashboardStud}

];

const router = new VueRouter({
    routes,
    store,
  });
  
export default router;