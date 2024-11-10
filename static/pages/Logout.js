const Logout = {
    template: `
      <div> 
        <h1 v-if="logoutSuccess">Successfully Logged Out</h1>
        <h1 v-else>Logout Unsuccessful</h1>
      </div>
    `,
    data() {
      return {
        logoutSuccess: false,
      };
    },
    async created() {
      console.log("Logout created lifecycle hook hit!");
  
      try {
        const res = await fetch(window.location.origin + "/logout", {
          method: "POST", // Use POST method for logout
          credentials: "same-origin", // Include cookies if needed for session management
        });
  
        if (res.ok) {
          this.logoutSuccess = true; // Correctly set boolean value
        } else {
          console.error("Logout request failed:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("An error occurred during logout:", error);
      }
    },
  };
  
  export default Logout;
  