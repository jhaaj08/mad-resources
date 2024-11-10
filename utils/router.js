import Navbar from  '../../components/Navbar.js'
import Home from '../../pages/Home.js'


const routes = [
    {path: '/', component: Home}

];
const router = new VueRouter(
    {routes,

    }
)

export default router;