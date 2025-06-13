<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Driver.js Nuxt Module

<!-- [![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href] -->

A Nuxt 3 module that brings the powerful [Driver.js](https://driverjs.com/) library to your Nuxt applications. Create beautiful, interactive product tours, feature highlights, and user onboarding flows with minimal effort. The module provides a declarative and programmatic API, supporting both CSS selectors and Vue template refs for maximum flexibility. With built-in TypeScript support, reactive state management, and a rich set of features, you can create engaging user experiences while maintaining full control over the tour flow and appearance.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🎨 **Fully Typed**: Complete TypeScript support with type definitions
- 🔌 **Auto-import**: Driver.js components and composables are auto-imported
- 🛠️ **Flexible API**: Choose between declarative and programmatic usage
- 🔄 **Reactive State**: Track tour progress and state with reactive properties
- 🎯 **Multiple Targeting**: Use CSS selectors or template refs to target elements
- 🎭 **Custom Components**: Built-in `Tour` component with slot support
- ✨ **Directive Support**: `v-step` and `v-highlight` directives for easy integration
- 🔄 **Progress Tracking**: Built-in progress indicators for multi-step tours
- 🎨 **Customizable**: Full access to Driver.js configuration options
- 🧩 **Modular**: Import only the features you need to keep your bundle small

## Quick Setup

1. Add the module to your Nuxt project:

```bash
npx nuxi module add nuxt-driverjs
```

2. The module will automatically register the necessary components and composables.

## Usage

### 1. Using `useDriver` Composable

The `useDriver` composable provides programmatic control over tours. There are two ways to use it:

#### Method 1: With CSS Selectors
```vue
<template>
  <div>
    <button @click="startTour">Start Tour</button>
    <div id="section1">First step content</div>
    <div id="section2">Second step content</div>
  </div>
</template>

<script setup>
const { drive, isActive } = useDriver({
  showProgress: true,
  steps: [
    {
      element: '#section1',
      popover: {
        title: 'First Step',
        description: 'This is the first step of the tour.'
      }
    },
    {
      element: '#section2',
      popover: {
        title: 'Second Step',
        description: 'This is the second step.'
      }
    }
  ]
});

const startTour = () => {
  drive();
};
</script>
```

#### Method 2: With Template Refs
```vue
<template>
  <div>
    <button @click="startTour">Start Tour</button>
    <div ref="step1">First step content</div>
    <div ref="step2">Second step content</div>
  </div>
</template>

<script setup>
const step1 = ref(null);
const step2 = ref(null);

const { drive, isActive } = useDriver({
  steps: [
    {
      element: step1,
      popover: {
        title: 'First Step',
        description: 'This is the first step of the tour.'
      }
    },
    {
      element: step2,
      popover: {
        title: 'Second Step',
        description: 'This is the second step.'
      }
    }
  ]
});

const startTour = () => {
  drive();
};
</script>
```

### 2. Using the `Tour` Component with `v-step`

The `Tour` component provides a declarative way to create tours using the `v-step` directive. **Note:** The `v-step` directive can only be used inside a `Tour` component.

```vue
<template>
  <Tour v-slot="{ drive, isActive: isTourActive }">
    <h1 v-step:1="{ title: 'Welcome', description: 'This is the first step' }">
      Welcome to Our App
    </h1>
    
    <div v-step:2="{ title: 'Features', description: 'Check out our features' }">
      Our Amazing Features
    </div>
    
    <button @click="drive">
      {{ isTourActive ? 'Stop Tour' : 'Start Tour' }}
    </button>
  </Tour>
</template>
```

### 3. Using `v-highlight` Directive

Highlight important elements anywhere in your app:

```vue
<template>
  <div>
    <button 
      v-highlight="{
        title: 'Important Feature',
        description: 'Click here to perform an important action',
        active: shouldHighlight
      }"
    >
      Important Button
    </button>
  </div>
</template>

<script setup>
const shouldHighlight = ref(true);
</script>
```

### Available Properties and Methods

#### `useDriver` Return Value
- `drive(stepIndex?)`: Start the tour or go to a specific step
- `isActive`: Whether the tour is currently active
- `state`: Current driver.js state
- `hasNextStep`: Whether there's a next step
- `hasPreviousStep`: Whether there's a previous step
- `activeIndex`: Current step index
- `activeStep`: Current step configuration
- `previousStep`: Previous step configuration
- `activeElement`: Currently highlighted DOM element
- `previousElement`: Previously highlighted DOM element

#### `Tour` Component
- **Props**:
  - `steps`: Array of step configurations (alternative to using `v-step`)
  - All other [Driver.js configuration options](https://driverjs.com/docs/configuration) are supported
- **Slot Props**:
  - `drive`: Function to start the tour
  - `isActive`: Boolean indicating if tour is active
  - `activeStep`: Current active step configuration
  - `activeIndex`: Current step index
  - All other state properties from `useDriver`


<!-- ## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details> -->


<!-- Badges
[npm-version-src]: https://img.shields.io/npm/v/nuxt-driverjs/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-driverjs

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-driverjs.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-driverjs

[license-src]: https://img.shields.io/npm/l/nuxt-driverjs.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-driverjs
-->
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com