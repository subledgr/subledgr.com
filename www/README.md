# [Nebula UI Kit](https://store.vuetifyjs.com/products/nebula-ui-ki)

A simple collection of components and layouts for building applications with Vuetify 3 and Vite.

**Nebula UI Kit** is a beautiful resource built over [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/guide/), [Vuetify 3](https://vuetifyjs.com/) and [Vuejs 3](https://vuejs.org/). It will help you get started and quickly developing your Vuetify 3 Vite applications in no time. Using the Vite theme is pretty simple but requires basic knowledge of Javascript, [Vuejs](https://vuejs.org) and [Vite](https://vitejs.dev/guide/).

## Getting Started

- Install Nodejs from the official [Nodejs page](https://nodejs.org/en/)
- Install Yarn from the official [Yarn installation page](https://classic.yarnpkg.com/en/docs/install/#windows-stable).
- Unzip the `nebula-ui-kit.zip` file downloaded from the Vuetify store
- Create a folder named `nebula-ui-kit` and unzip the `nebula-ui-kit.zip` file provided by the previous step
- Open your terminal and navigate to the `nebula-ui-kit` directory
- Run `yarn install` to install the project's dependencies
- Run `yarn dev` to start a local development server

You can also run additional tasks such as

- `yarn run build` to build your app for production
- `yarn run serve` to serve your production app
- `yarn run lint` to run linting.

## Vuetify

Vuetify is an Open Source UI Library that is developed exactly according to Material Design spec. Every component is handcrafted to bring you the best possible UI tools to your next great app. The development doesn't stop at the core components outlined in Google's spec. Through the support of community members and sponsors, additional components will be designed and made available for everyone to enjoy.

The documentation for **Vuetify** is hosted [here](https://vuetifyjs.com/).

***Not all components that are available in this project are part of the theme and may be a default Vuetify component***

## Vite

Vite is a build tool that significantly improves the front-end development experience. You can use Vite to set up a development environment for frameworks like Vue and React, and even for a vanilla JavaScript app with a dev server and hot reloading in just three commands. It also easily integrates with [TypeScript](https://vitejs.dev/guide/features.html#typescript).

## Table of Contents

- [Demo](#demo)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [File Structure](#file-structure)
- [Browser Support](#browser-support)
- [Resources](#resources)
- [Reporting Issues](#reporting-issues)
- [Technical Support or Questions](#technical-support-or-questions)
- [Licensing](#licensing)
- [Useful Links](#useful-links)

## Demo

- [Demo page](https://store.vuetifyjs.com/products/nebula-ui-kit/preview)

## File Structure

Within the download you'll find the following directories and files:

<details>

```txt
nebula-ui-kit/
├── .browserslistrc
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── README.md
├── index.html
├── package.json
├── public
│   ├── favicon.ico
│   └── nebula.png
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── content
│   │   │   └── content4.jpg
│   │   ├── heroheaders
│   │   │   ├── heroheaders1.png
│   │   │   └── heroheaders2.png
│   │   ├── logo.png
│   │   ├── logo.svg
│   │   ├── nebula.png
│   │   └── pricing
│   │       ├── pricing-icon1.png
│   │       └── pricing-icon2.png
│   ├── components
│   │   ├── Logo.vue
│   │   ├── blog
│   │   │   ├── Blog-v1.vue
│   │   │   └── Blog-v2.vue
│   │   ├── call-to-action
│   │   │   ├── CalltoAction-v1.vue
│   │   │   └── CalltoAction-v2.vue
│   │   ├── contact
│   │   │   ├── Contact-v1.vue
│   │   │   └── Contact-v2.vue
│   │   ├── content
│   │   │   ├── Content-v1.vue
│   │   │   ├── Content-v2.vue
│   │   │   ├── Content-v3.vue
│   │   │   └── Content-v4.vue
│   │   ├── ecommerce
│   │   │   ├── Ecommerce-v1.vue
│   │   │   └── Ecommerce-v2.vue
│   │   ├── features
│   │   │   ├── Features-v1.vue
│   │   │   └── Features-v2.vue
│   │   ├── footer
│   │   │   ├── Footer-v1.vue
│   │   │   └── Footer-v2.vue
│   │   ├── gallery
│   │   │   ├── Gallery-v1.vue
│   │   │   └── Gallery-v2.vue
│   │   ├── header
│   │   │   ├── Header-v1.vue
│   │   │   ├── Header-v10.vue
│   │   │   ├── Header-v2.vue
│   │   │   ├── Header-v3.vue
│   │   │   ├── Header-v4.vue
│   │   │   ├── Header-v5.vue
│   │   │   ├── Header-v6.vue
│   │   │   ├── Header-v7.vue
│   │   │   ├── Header-v8.vue
│   │   │   └── Header-v9.vue
│   │   ├── hero-headers
│   │   │   ├── HeroHeaders-v1.vue
│   │   │   └── HeroHeaders-v2.vue
│   │   ├── pricing
│   │   │   ├── PricingTable-v1.vue
│   │   │   └── PricingTable-v2.vue
│   │   ├── team
│   │   │   ├── Team-v1.vue
│   │   │   └── Team-v2.vue
│   │   ├── testimonial
│   │   │   ├── Testimonial-v1.vue
│   │   │   └── Testimonial-v2.vue
│   │   └── title
│   │       ├── Title-v1.vue
│   │       ├── Title-v2.vue
│   │       ├── Title-v3.vue
│   │       ├── Title-v4.vue
│   │       ├── Title-v5.vue
│   │       └── Title-v6.vue
│   ├── layouts
│   │   └── default
│   │       ├── Default.vue
│   │       ├── Drawer.vue
│   │       └── View.vue
│   ├── main.ts
│   ├── plugins
│   │   ├── defaults.ts
│   │   ├── global-components.ts
│   │   ├── index.ts
│   │   └── vuetify.ts
│   ├── router
│   │   └── index.ts
│   ├── styles
│   │   ├── overrides.scss
│   │   └── settings.scss
│   ├── views
│   │   ├── blog
│   │   │   └── index.vue
│   │   ├── call-to-action
│   │   │   └── index.vue
│   │   ├── contact
│   │   │   └── index.vue
│   │   ├── content
│   │   │   └── index.vue
│   │   ├── ecommerce
│   │   │   └── index.vue
│   │   ├── features
│   │   │   └── index.vue
│   │   ├── footer
│   │   │   └── index.vue
│   │   ├── gallery
│   │   │   └── index.vue
│   │   ├── headers
│   │   │   └── index.vue
│   │   ├── hero-headers
│   │   │   └── index.vue
│   │   ├── pricing
│   │   │   └── index.vue
│   │   ├── team
│   │   │   └── index.vue
│   │   ├── testimonial
│   │   │   └── index.vue
│   │   └── title
│   │       └── index.vue
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```

</details>

## Browser Support

| Browser | Status |
| - | - |
| Chromium (Chrome, Edge) | ✅ Supported * |
| Firefox | ✅ Supported * |
| Safari 15.4+ | ✅ Supported |
| Safari 13. | ❗ Requires polyfill |
| Edge <79 | ⛔ Not supported |
| Internet Explorer | ⛔ Not supported |

## Resources

- [Live Preview](https://theme-vite-free.vercel.app/)
- Product Page: [Product](https://store.vuetifyjs.com/products/nebula-ui-kit)
- Vuetify Documentation is [Here](https://vuetifyjs.com/)
- Contact: [Contact](mailto:support@vuetifyjs.com)

## Reporting Issues

Please report issues to the [Vuetify Discord](https://community.vuetifyjs.com)

## Licensing

- Copyright 2023 Vuetify <https://vuetifyjs.com/>
- Vuetify [License Information](https://github.com/vuetifyjs/vuetify/blob/master/LICENSE.md)

## Useful Links

- [Vuetify Documentation](https://vuetifyjs.com/)
- [Vuetify Store](https://store.vuetifyjs.com/)
- [Discord](https://community.vuetifyjs.com)
- [Twitter](https://twitter.com/vuetifyjs)

<br>

<p align="center">
  <img src="https://cdn.vuetifyjs.com/docs/images/logos/v.png" height="128">
</p>
