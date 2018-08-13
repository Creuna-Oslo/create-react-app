This project was created with [@creuna/create-react-app](https://www.npmjs.com/package/@creuna/create-react-app).

## Install dependencies

```
yarn
```

## Scripts

Available scripts are defined in `package.json`. The most important ones are:

* **dev**: Run Webpack dev server
* **build**: Build bundle for production
* **build:static**: Build static mockup site

Example:

```
yarn dev
```

## Build

The `build` script outputs files to `./dist`. Important files to know about:

* `client.js`: This is where all of your authored code ends up.
* `vendor.js`: All of your `npm`-dependencies.
* `server.js`: Bundle for server-side rendering the React-components. It contains everything from `client.js` and `vendor.js`.
* `style.css`: Compiled sass
* `manifest.json`: Contains a list of mappings from bundle name to hashed bundle name.

Both `client.js` and `vendor.js` should be served to the client. Because of the file hashing, these can be cached indefinitely in the browser.

`server.js` has all React components defined in a global `Components` object.

On the backend, use `manifest.json` to get the latest version of the built files.

## Generated files

* `./source/app.components.js`: This file exports all components directly descending `source/components` where the name of the folder and the name of the `.jsx` file are the same. This file is included in all of the javascript bundles.
* `./source/mockup/pages/pages.js`: Exports all of the components in `source/mockup/pages`. It is used to build the front page of the mockup.

## Development

### React components

Put React components in `source/components`. These components won't do much on their own, so it's useful to add some mockup pages to `source/mockup/pages` to have somewhere to render your components while developing them.

Every folder in `source/mockup/pages` that has a react component will be rendered to an HTML page when running `yarn dev`. When adding a new page, you have to restart Webpack dev server in order for your new page to be visible on the front page.

By default, links on the home page will be generated from the component names of the mockup pages. You can override these names by adding a comment at the top of the `.jsx` file. You can group pages together by using a forward slash in this comment.

article-page.jsx:

```jsx
// Redaksjonelle sider/Artikkelside
```

This will cause the group 'Redaksjonelle sider' to appear on the front page, with a link to 'Artikkelside', which points to `article-page.html`.

You can put global things in `source/mockup/layout.jsx` so you don't have to repeat them for every page.

It's recommended to put mock data in a `.json` file in the same folder as the mockup page component. Check out the provided example page!

### Styles

The main entry point for styles is `source/scss/styles.scss`. This file imports any and all `.scss` files in `source/components`. After adding new `.scss` files you need to restart Webpack dev server in order for them to be discovered.

### Mock content

Put your mock assets (images etc.) in `source/mockup/assets` and your mock api responses in `source/mockup/api`. The contents of these folders are copied to `/mockup/assets` and `/mockup/api` (relative to the build directory) when building.

Example:

```json
{
  "imageUrl": "/mockup/assets/my-image.jpg",
  "APIEndpointUrl": "/mockup/api/api-endpoint.json"
}
```

## Code formatting

`./.eslintrc.json` includes config for using `prettier` to format your source code. In addition to making your code look pretty, this helps to enforce a consistent coding style within your project. There are plugins for Prettier to most of the major editors (like VS code, Sublime). You should install the Prettier-pugin for your editor. It is very nice.
