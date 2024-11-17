import store from "../utils/store.js"

const Navbar = {
    template: `
    <nav>
      <router-link to='/'>Home</router-link>
      <router-link v-if="!state.loggedIn" to='/login'>Login</router-link>
      <router-link v-if="!state.loggedIn" to='/signup'>Signup</router-link>
      <router-link v-if="state.loggedIn" to='/logout'>Logout</router-link>
      <router-link v-if="state.loggedIn" to='/profile'>Profile</router-link>
      <router-link v-if="state.loggedIn && state.role === 'inst' "to='/dashboard-inst'>Dashboard</router-link>
      <router-link v-if="state.loggedIn && state.role === 'stud' " to='/dashboard'>Dashboard</router-link>
    </nav>
    ` ,
    data() {
        return {
            url: window.location.origin + "/logout",
        };
    },
    methods: {
        logout() {
          // clear session
          sessionStorage.clear();
    
          // clear vuex login info
          this.$store.commit("logout");
          this.$store.commit("setRole", null);
    
          this.$router.push("/");
        },
      },    
    computed: {
        state() {
            return this.$store.state;
        }
    },
};

export default Navbar;

