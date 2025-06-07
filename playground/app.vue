<template>
  <section>
    <h1>DriverJS Module</h1>
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
    <button @click="() => {}">
      Start
    </button>
  </section>
</template>

<script setup lang="ts">
// import { CustomSection } from '#components'

// const vTour = {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   created(el: HTMLElement, binding: any, vnode: any) {
//     // client-side implementation:
//     // directly update the DOM
//     console.log(vnode)
//     el.id = `tour-${binding.value}`
//   },
// }
const section1 = useTemplateRef('section1')
const section2 = useTemplateRef('section2')
const section3 = useTemplateRef('section3')
const section4 = useTemplateRef('section4')
const section5 = useTemplateRef('section5')

useDriver({
  autoRun: true,
  showProgress: true,
  steps: [
    { element: section1, popover: { title: 'Title', description: 'Description' } },
    { element: section2, popover: { title: 'Title', description: 'Description' } },
    { element: section3, popover: { title: 'Title', description: 'Description' } },
    { element: section4, popover: { title: 'Title', description: 'Description' } },
    { element: section5, popover: { title: 'Title', description: 'Description' } },
  ],
})

// onMounted(() => {
//   const driverObj = driver({
//     showProgress: true,
//     steps: [
//       { element: '.section-1', popover: { title: 'Title', description: 'Description' } },
//       { element: '.section-2', popover: { title: 'Title', description: 'Description' } },
//       { element: '.section-3', popover: { title: 'Title', description: 'Description' } },
//       { element: '.section-4', popover: { title: 'Title', description: 'Description' } },
//       { element: '.section-5', popover: { title: 'Title', description: 'Description' } },
//     ],
//   })

//   driverObj.drive()
// })
</script>

<style scoped>
div {
  padding: 1rem;
  border: 1px solid black;
  margin-bottom: 1rem;
}
</style>
