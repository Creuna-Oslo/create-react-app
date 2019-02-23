This project was created with [@creuna/create-react-app](https://www.npmjs.com/package/@creuna/create-react-app).

## Install dependencies

```
yarn
```

## Scripts

Available scripts are defined in `package.json`. The most important ones are:

- **dev**: Start development environment
- **build**: Build bundle for production using a dynamic backend
- **build:static**: Build static site

Example:

```
yarn dev
```

## Build

The `build` script outputs files to `./dist`. Important files to know about:

- `client.js`: This is where all of your authored code ends up.
- `vendor.js`: All of your `npm`-dependencies.
- `server.js`: Bundle for server-side rendering the React-components. It contains everything from `client.js` and `vendor.js`, minus some unneeded polyfills. This is not output when building a static site.
- `style.css`: Compiled Sass
- `manifest.json`: Contains a list of mappings from source file to emitted file

Both `client.js` and `vendor.js` should be served to the client. Because we do chunk hashing, these can be cached indefinitely.

When building for a dynamic backend, `server.js` will have all React components defined in a global `Components` object.

On the backend, use `manifest.json` to look up which files to load and serve.

## Generated files

- `./source/app.components.js`: This file exports all components directly descending `source/components` where the name of the folder and the name of the `.jsx` file are the same. This file is included in all of the javascript bundles.
- `./source/static-site/pages/pages.js`: Exports all of the components in `source/static-site/pages`. It is used to build the static site.
- `./source/static-site/pages/paths.js`: Exports all of the paths to the static site pages. It is used to build the static site.

## Development

### React components

Put React components in `source/components`. If the folder and the `jsx` file have the same name, the component will be included in the generated `app.components.js` file which can be used to render components on a backend (like ReactJS.NET).

When building a static site, `app.components.js` is not generated and `server.js` is not output as part of the build.

### Import paths

`webpack.config` specifies two aliases (under `resolve.alias`) that make importing files easier:

- `components` which resolves to `source/components`
- `js` which resolves to `source/js`

Also, `directory-named-webpack-plugin` is used to automatically import files that have the same name as their containing folder. Examples:

```js
// <project root>/source/components/some-component/some-component.jsx
import SomeComponent from "components/some-component";

// <project root>/source/js/some-script.js
import someScript from "js/some-script";
```

The aliases are also included in `jsconfig.json` which makes VS Code resolve the same aliases, giving you autocomplete.

### Static Site

All static site pages (`source/static-site/pages`) that have a folder and a component with the same name, will get a link in the page index (found by default at `/`). You can customize the name, group name, and path of the page in the page's `jsx` file by adding frontmatter to the first line like this:

```js
/*
group: Custom group name
name: Custom page name
path: /custom-path
*/
```

All properties are optional.

Pages with the same group name will be grouped under this name.

#### Assets

Put your assets like fonts, icons and logos in `source/assets`. Static site content assets can be put in `source/static-site/assets`. Webpack copies everything from there to `/static-site/assets`, so you can refer to your static content files like this:

```json
{
  "imageUrl": "/static-site/assets/my-image.jpg"
}
```

#### API Responses

Webpack will copy everything from `source/static-site/api` to `/static-static/api` so you can reference your static API responses like this:

```json
{
  "apiEndpoint": "/static-site/api/register-user.json"
}
```

### Styles

The main entry point for styles is `source/scss/styles.scss`. This file imports any and all `.scss` files in `source/components`. After adding new `.scss` files you need to run `yarn dev` again in order for them to be discovered.

## Input detection

`js/input-detection.js` is included. It checks for mouse, touch and keyboard events and puts classes on `<html>`:

- `.mouse-user`: The last event was either a mouse or touch event (this is removed when a keyboard event occurs)
- `.touchevents`: The last event was a touch event
- `.no-touchevents`: The last event was not a touch event

By default, all focus outlines are disabled when the `.mouse-user` class is present (in `site.scss`). No class names are present if js is disabled in the browser, meaning focus outlines are preserved.

You can use these classnames to provide alternative styling based on input method (like disabling hover effects for touch screens).

## Code formatting

`./.eslintrc.json` includes config for using [prettier](https://prettier.io) to format your source code. In addition to making your code look pretty, this helps to enforce a consistent coding style within your project. There are plugins for Prettier to most of the major editors (like [VS code](https://code.visualstudio.com) or [Sublime](https://www.sublimetext.com)). You should install the Prettier-pugin for your editor. It is very nice.

## UI Testing

[TestCafé](https://devexpress.github.io/testcafe/) is included for easy end to end testing. There is an example test provided in `/tests/example-page.js`.

### Things to note

- run tests with `yarn test:ui` or `npm run test:ui`
  - The development server must already be running for this to work (`yarn dev` or `npm run dev`)
- TestCafé will find and run all tests in located directly in `./tests`
