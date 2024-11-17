import StudyResource from "../components/StudyResource.js";

const DashBoardInst = {
  template: `<div>
            <h1>Instructor dashboard</h1>
            <h2>New Resources</h2>
            <div v-for="res in newResources" :key="res.id">
              <StudyResource :topic="res.topic" :content="res.content" creator="me" :approvalRequired="true" :approvalID="res.id" />
            </div>

            <h2>Approved Resources </h2>
            <div v-for="resource in allResources" :key="resource.id">   
                    <StudyResource :topic="resource.topic" :content="resource.content" creator="me"/>
            </div>
    </div>`,
  data() {
    return {
      newResources: [],
      allResources: [],
    };
  },
  async mounted() {
    try {
      const resNewRes = await fetch(`${window.location.origin}/api/resources/unapproved`, {
        headers: {
          "Authentication-Token": sessionStorage.getItem("token"),
        },
      });

      if (resNewRes.ok) {
        this.newResources = await resNewRes.json();
        console.log('New Resources:', this.newResources);
      } else {
        console.error('Failed to fetch new resources:', resNewRes.status, resNewRes.statusText);
      }

      const resAllRes = await fetch(`${window.location.origin}/api/resources`, {
        headers: {
          "Authentication-Token": sessionStorage.getItem("token"),
        },
      });

      if (resAllRes.ok) {
        const data = await resAllRes.json();
        this.allResources = data;
        console.log('All Resources:', this.allResources);
      } else {
        console.error('Failed to fetch all resources:', resAllRes.status, resAllRes.statusText);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  },
  components: { StudyResource },
};

export default DashBoardInst;