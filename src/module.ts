import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addImportsSources,
  addPlugin,
  addComponentsDir,
} from '@nuxt/kit'

// Module options TypeScript interface definition
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.css.push('driver.js/dist/driver.css')
    addImportsSources([
      {
        from: 'driver.js',
        imports: ['driver'],
      },
      {
        from: 'driver.js',
        type: true,
        imports: [
          'Config',
          'Driver',
          'DriveStep',
          'AllowedButtons',
          'PopoverDOM',
          'State',
          'Popover',
        ],
      },
    ])

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addImportsDir(resolver.resolve('./runtime/composables'))

    addPlugin(resolver.resolve('./runtime/plugins/highlight-directive'))
    addPlugin(resolver.resolve('./runtime/plugins/step-directive'))

    addComponentsDir({ path: resolver.resolve('./runtime/components') })
  },
})
