# MASR ERP ( Masr Enterprise resource planning)

This developing with Vue 3 in Vite.

## Additional Information

- must to depoly in http server with name folder "erp-msar"
- can access to http://localhost/erp-masr

## Additional Library

- UI
- <https://tailwind-elements.com/quick-start/>
- <https://daisyui.com/docs/install/>
- <https://vant-ui.github.io/vant/#/en-US/quickstart>
- Alert Design
- <https://sweetalert2.github.io/#examples>
- Validation
- <https://vee-validate.logaretm.com/v4/examples/custom-inputs/>
- Permission
- <https://github.com/fullstackfool/vacl>
- for icons
- <https://heroicons.com/>
- <https://www.flaticon.com/>
- for flag icons
- <https://icones.js.org/> installation: <https://www.youtube.com/watch?v=a6XI8XAuORM>
- online photoshop
- <https://www.photopea.com/>

## NPM Commands

- npm i -D vue-tsc@latest // for update last version vue-tsc

## Rules of naming system

- name of multi-word component must to be Pascal Case
- name of variables multi-word component must to be Pascal Case
- name of variables must to be clear ( ex : customPath)

## Svg file in assets/svg folder , use of it in design code

```html
exmaple <img src="@/assets/svg/logo.svg" alt="avatar" class="w-8 h-8 rounded-full" />
```

- name of multi-word component must to be Pascal Case
- name of variables multi-word component must to be Pascal Case
- name of variables must to be clear ( ex : customPath)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Global Config

for ignore capitalization of directory git

```git
git config core.ignorecase false
```

NPM update all to latest version

```node
npm install -g npm@latest
npx npm-check-updates -u
npm install

```
