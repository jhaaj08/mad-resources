import store from "../utils/store.js"

const Navbar = {
    template: `
    <nav>
      <router-link to='/'>Home</router-link>
      <router-link v-if="!loggedIn" to='/login'>Login</router-link>
      <router-link v-if="!loggedIn" to='/signup'>Signup</router-link>
      <router-link v-if="loggedIn" to='/logout'>Logout</router-link>
      <router-link  to='/dashboard'>Dashboard</router-link>
    </nav>
    ` ,
    data() {
        return {
            url: window.location.origin + "/logout",
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.loggedIn;
        }
    },
};

export default Navbar;

