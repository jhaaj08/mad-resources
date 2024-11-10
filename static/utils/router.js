import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Logout from "../pages/Logout.js";


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/logout', component: Logout},

];

const router = new VueRouter({
    routes,
  });
  
export default router;