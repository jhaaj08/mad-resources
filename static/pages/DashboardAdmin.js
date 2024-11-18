import store from "../utils/store.js"; // Import Vuex store

const DashboardAdmin = {
  template: `
    <div>
        <h1> Admin Dashboard </h1>
        <h2> Inactive Instructors </h2>
        <div v-for="user in inactiveInst" :key="user.id">
            <div class="justify"> 
              <span> email: {{ user.email }} </span> 
              <span> 
                <button class="btn btn-secondary" @click="activate(user.id)"> Activate </button> 
              </span> 
            </div>
        </div>
    </div>
  `,
  data() {
    return {
      inactiveInst: [],
    };
  },
  methods: {
    async activate(id) {
      try {
        const res = await fetch(`${window.location.origin}/activate-inst/${id}`, {
          method: "POST", // Typically an activation should be a POST request.
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": store.state.token, // Get token from Vuex store
          },
        });

        if (res.ok) {
          alert("Instructor activated");
          // Optionally, update the `inactiveInst` list to remove the activated user.
          this.inactiveInst = this.inactiveInst.filter(user => user.id !== id);
        } else {
          alert("Failed to activate instructor: " + res.statusText);
        }
      } catch (error) {
        console.error("Error activating instructor:", error);
        alert("An error occurred while trying to activate the instructor.");
      }
    },
  },
  async mounted() {
    const role = store.state.role; // Get the role from Vuex store
    console.log("Role from Vuex store:", role); // Log the role for debugging

    try {
      const res = await fetch(`${window.location.origin}/inactive-inst-list`, {
        headers: {
          "Authentication-Token": store.state.token, // Use token from Vuex store
          "Role": role, // Use role from Vuex store
        },
      });

      if (res.ok) {
        this.inactiveInst = await res.json();
      } else {
        console.error("Failed to fetch inactive instructors:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error fetching inactive instructors:", error);
    }
  },
};

export default DashboardAdmin;