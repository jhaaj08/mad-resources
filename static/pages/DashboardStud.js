import StudyResource from "../components/StudyResource.js";

const DashboardStud = {
  template: `
    <div>
      <h1>This is student dashboard</h1>
      <div class="d-flex flex-row p-5" v-for="resource in allResources" :key="resource.id">
        <StudyResource :topic="resource.topic" :content="resource.content" />
      </div>
    </div>
  `,
  components: {
    StudyResource,
  },
  data() {
    return {
      allResources: [],
    };
  },
  async mounted() {
    try {
      const fetchUrl = `${window.location.origin}/api/resources`;
      console.log('Fetch URL:', fetchUrl); // Debugging URL
      const res = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": sessionStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch resources: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      this.allResources = data;
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  },
};

export default DashboardStud;
