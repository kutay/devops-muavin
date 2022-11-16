<template>
  <div>
    <table class="table">
      <tbody>
        <tr v-for="ingress in ingressesByName">
          <td>{{ ingress.namespace }}</td>
          <td>{{ ingress.name }}</td>
          <td>{{ ingress.ingressClassName }}</td>
          <td>{{ ingress.rules.length }} rules</td>
          <td>{{ ingress.rules.map((item) => item.host) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      ingresses: [
        {
          name: "foobar",
          namespace: "default",
          ingressClassName: "nginx",
          rules: [
            {
              host: "example.com",
              http: {
                paths: [
                  {
                    path: "/",
                    backend: {
                      service: {
                        name: "foo-bar",
                        port: 80
                      }
                    }
                  }
                ]
              }
            }, {
              host: "admin.example.com",
              http: {
                paths: [
                  {
                    path: "/",
                    backend: {
                      service: {
                        name: "foo-bar",
                        port: 80
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  computed: {
    ingressesByName() {
      return this.ingresses;
    },
    ingressesByHost() {
      // `this` points to the component instance
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
</script>

<style>

</style>