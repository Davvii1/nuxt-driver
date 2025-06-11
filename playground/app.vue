<template>
  <section>
    <h1>DriverJS Module</h1>
    <div v-highlight="{ title: 'Title', description: 'Description', active: false }">
      Highlight 1
    </div>
    <div id="section1">
      Section 1
    </div>
    <div id="section2">
      Section 2
    </div>
    <div id="section3">
      Section 3
    </div>
    <div id="section4">
      Section 4
    </div>
    <div id="section5">
      Section 5
    </div>
    <button @click="() => drive()">
      Start
    </button>
    {{ isActive }}
  </section>

  <section>
    <h1>DriverJS Module 2</h1>
    <div ref="secondTour1">
      Section 1
    </div>
    <div ref="secondTour2">
      Section 2
    </div>
    <div ref="secondTour3">
      Section 3
    </div>
    <div ref="secondTour4">
      Section 4
    </div>
    <div ref="secondTour5">
      Section 5
    </div>
    <button @click="() => driveSecond()">
      Start 2
    </button>
    {{ isActiveSecond }}
  </section>

  <Tour v-slot="{ drive: driveTour, isActive: isActiveTour }">
    <h1 v-step:1="{ title: 'Step 1', description: 'Description' }">
      DriverJS Tour 1
    </h1>
    <h1 v-step:2="{ title: 'Step 2', description: 'Description' }">
      DriverJS Tour 2
    </h1>
    <h1 v-step:4="{ title: 'Step 3', description: 'Description' }">
      DriverJS Tour 3
    </h1>
    <h1 v-step:3="{ title: 'Step 4', description: 'Description' }">
      DriverJS Tour 4
    </h1>
    <h1>
      DriverJS Tour 5
    </h1>
    <button @click="driveTour()">
      Start
    </button>
    {{ isActiveTour }}
  </Tour>
</template>

<script setup lang="ts">
const { drive, isActive } = useDriver({
  showProgress: true,
  steps: [
    { element: '#section1', popover: { title: 'Title', description: 'Description' } },
    { element: '#section2', popover: { title: 'Title', description: 'Description' } },
    { element: '#section3', popover: { title: 'Title', description: 'Description' } },
    { element: '#section4', popover: { title: 'Title', description: 'Description' } },
    { element: '#section5', popover: { title: 'Title', description: 'Description' } },
  ],
})

const secondTour1 = useTemplateRef('secondTour1')
const secondTour2 = useTemplateRef('secondTour2')
const secondTour3 = useTemplateRef('secondTour3')
const secondTour4 = useTemplateRef('secondTour4')
const secondTour5 = useTemplateRef('secondTour5')

const { drive: driveSecond, isActive: isActiveSecond } = useDriver({
  steps: [
    { element: secondTour1, popover: { title: 'Title', description: 'Description' } },
    { element: secondTour2, popover: { title: 'Title', description: 'Description' } },
    { element: secondTour3, popover: { title: 'Title', description: 'Description' } },
    { element: secondTour4, popover: { title: 'Title', description: 'Description' } },
    { element: secondTour5, popover: { title: 'Title', description: 'Description' } },
  ],
})
</script>

<style scoped>
div {
  padding: 1rem;
  border: 1px solid black;
  margin-bottom: 1rem;
}
</style>
