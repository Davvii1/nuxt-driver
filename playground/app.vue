<template>
  <section>
    <h1>DriverJS Module</h1>
    <div v-highlight="{ title: 'Title', description: 'Description', active: false }">
      Highlight 1
    </div>
    <div ref="section1">
      Section 1
    </div>
    <div ref="section2">
      Section 2
    </div>
    <div ref="section3">
      Section 3
    </div>
    <div ref="section4">
      Section 4
    </div>
    <div ref="section5">
      Section 5
    </div>
    <button @click="() => instance.drive()">
      Start
    </button>
  </section>

  <section>
    <h1>DriverJS Module 2</h1>
    <div class="section1">
      Section 1
    </div>
    <div class="section2">
      Section 2
    </div>
    <div class="section3">
      Section 3
    </div>
    <div class="section4">
      Section 4
    </div>
    <div class="section5">
      Section 5
    </div>
    <button @click="() => driver2nd.drive()">
      Start 2
    </button>
  </section>

  <Tour v-slot="{ drive }">
    <button @click="drive">
      Start
    </button>
  </Tour>
</template>

<script setup lang="ts">
const section1 = useTemplateRef('section1')
const section2 = useTemplateRef('section2')
const section3 = useTemplateRef('section3')
const section4 = useTemplateRef('section4')
const section5 = useTemplateRef('section5')

const { instance } = useDriver({
  autoRun: false,
  showProgress: true,
  steps: [
    { element: section1, popover: { title: 'Title', description: 'Description' } },
    { element: section2, popover: { title: 'Title', description: 'Description' } },
    { element: section3, popover: { title: 'Title', description: 'Description' } },
    { element: section4, popover: { title: 'Title', description: 'Description' } },
    { element: section5, popover: { title: 'Title', description: 'Description' } },
  ],
})

const driver2nd = driver({ steps: [
  { element: '.section1', popover: { title: 'Title', description: 'Description' } },
  { element: '.section2', popover: { title: 'Title', description: 'Description' } },
  { element: '.section3', popover: { title: 'Title', description: 'Description' } },
  { element: '.section4', popover: { title: 'Title', description: 'Description' } },
  { element: '.section5', popover: { title: 'Title', description: 'Description' } },
] })
</script>

<style scoped>
div {
  padding: 1rem;
  border: 1px solid black;
  margin-bottom: 1rem;
}
</style>
