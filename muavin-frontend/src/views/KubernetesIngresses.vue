<template>
  <div>

    <input class="input" />
    <hr />

    <table class="table is-striped is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>Namespace</th>
          <th>Name</th>
          <th>Ingress class</th>
          <th>Nb Rules</th>
          <th>Rules</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ingress in ingressesByName">
          <td>{{ ingress.namespace }}</td>
          <td>{{ ingress.name }}</td>
          <td>{{ ingress.ingressClassName }}</td>
          <td>{{ ingress.rules.length }} rules</td>
          <td>
            <div v-for="rule in ingress.rules">{{ rule.host }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useKubernetes } from '@/stores/k8s'

export default {
  computed: {
    ...mapState(useKubernetes, ['ingresses']),
    ingressesByName() {
      return this.ingresses;
    },
    ingressesByHost() {
      // `this` points to the component instance
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  },
  mounted() {
    useKubernetes().fetchIngresses();
  }

}
</script>

<style>

</style>