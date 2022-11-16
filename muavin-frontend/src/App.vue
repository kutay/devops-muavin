<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>


<template>
  <span>
    <sidebar-menu :menu="menu" :showChild="true" class="item" />
  </span>
  <div id="app-content">
    <RouterView />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          header: 'Muavin',
          hiddenOnCollapse: true,
        },
        {
          href: '/',
          title: 'Home',
          icon: 'fa fa-user'
        },

        {
          href: '/k8s_dashboard',
          title: 'Kubernetes',
          icon: 'fa fa-chart-area',
          child: [
            {
              href: '/k8s/ingress',
              title: 'Ingress'
            },
            {
              href: '/k8s/helm',
              title: 'Helm'
            },
            {
              href: '/k8s/images',
              title: 'Images'
            }
          ]
        },

        {
          href: '/gcp_dashboard',
          title: 'GCP',
          icon: 'fa fa-chart-area',
          child: [
            {
              href: '/gcp/gke',
              title: 'GKE'
            }
          ]
        }
      ]
    }
  }
}
</script>


<style scoped>
DIV#app-content {
  width: 100%;
}
</style>
