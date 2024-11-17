const StudyResource = {
  template: `
    <div>
      <div class="card shadow-sm p-4 mb-4 study-resource-card" @click="openPopup">
        <div class="card-body">
          <h3 class="card-title text-center mb-3 text-primary text-truncate">{{ topic }}</h3>
          <p class="card-text text-secondary text-truncate">{{ content }}</p>
          <button v-if="approvalRequired" class="btn btn-success mt-3" @click.stop="sendApproval">Approve</button>
        </div>
        <div class="card-footer text-muted text-end">
          <small>Created by: {{ creator }}</small>
        </div>
      </div>

      <!-- Popup Container -->
      <div v-if="showPopup" class="popup-overlay d-flex align-items-center justify-content-center">
        <div class="popup-content card shadow p-4">
          <h3 class="card-title text-center mb-3 text-primary">{{ topic }}</h3>
          <p class="card-text text-secondary">{{ content }}</p>
          <div class="text-muted text-end mt-3">
            <small>Created by: {{ creator }}</small>
          </div>
          <button v-if="approvalRequired" class="btn btn-success mt-3" @click="sendApproval">Approve</button>
          <button class="btn btn-secondary mt-3" @click="closePopup">Close</button>
        </div>
      </div>
    </div>
  `,
  props: {
    topic: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    approvalRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    approvalID: {
      type: Number,
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  methods: {
    openPopup() {
      this.showPopup = true;
      console.log('Popup opened:', this.showPopup);
      console.log('Approval Required:', this.approvalRequired);
    },
    closePopup() {
      this.showPopup = false;
      console.log('Popup closed:', this.showPopup);
    },
    async sendApproval() {
      try {
        const res = await fetch(
          window.location.origin + "/verify-resource/" + this.approvalID,
          {
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": sessionStorage.getItem("token"),
            },
          }
        );
        if (res.ok) {
          console.log("Approval successful");
        } else {
          console.error("Approval failed", res.statusText);
        }
      } catch (error) {
        console.error("Error in approval request: ", error);
      }
    },
  },
  mounted() {
    console.log('Mounted - Approval Required:', this.approvalRequired);
  },
  updated() {
    console.log('Updated - Approval Required:', this.approvalRequired);
  },
  created() {
    console.log('Created - Approval Required:', this.approvalRequired);
  },
};

export default StudyResource;
