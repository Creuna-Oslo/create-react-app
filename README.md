# create-react-app

>React app boilerplate

<!--
## Steps
1. `npm install -g @creuna/create-react-app`
1. `cd` to project folder
1. `@creuna/create-react-app`
1. answer all the questions
1. `yarn`
1. `yarn dev`
-->

## Options

### ✏️ Project name
This will be used in `package.json` as well for `<title>` in the mockup and `<h1>` on the mockup frontpage.

---

### ✏️ Your full name
Used in the `author` field in `package.json`

---

### 💌 Your email address
Used in the `author` field in `package.json`

---

### ☁️ Include API-helper?
If you select this, `source/js/api-helper.js` will be included. This is a handy abstraction of `fetch` that supports automating analytics (optional), showing status messages (optional) and working with mock API responses.

#### Usage:
```js
api.execute(url, data).then(response => {
  // do something with response
}
```

---

### 💬 Include message helper for API?
If you select this, `source/js/messenger.js` and `source/components/message` will be included. Also, the messenger helper is automagically wired up with the API-helper.

#### Usage:
For the messenger helper to work, API responses have to be formatted as follows:

```json
{
  "success": true,
  "messageToUser": "Your request succeeded!",
  "payload": {
    //actual content of API response
  }
}
```

If an API response includes a `messageToUser`, it will tell the `Message` component to show it. The `success` property tells the `Message` component whether to display the message as an error or as a confirmation. The `Message` component needs to be rendered somewhere in order to work.

When a `payload` object is present in the response, only the content of `payload` will be returned from `api.execute`.

---

### 📈 Include Analytics helper?
If you select this, `source/js/analytics.js` will be included and wired up to work with the API-helper. 

#### Usage:
```js
const analyticsData = {}; // some google analytics data

analytics.send(analyticsData);
```

This will push `analyticsData` to `window.dataLayer`. `send` supports both objects and arrays. When a `payload` object is present in the response, only the content of `payload` will be returned from `api.execute`.

#### With API-helper

```json
{
  "analytics": {
    // some analytics data here
  },
  "payload": {
    //actual content of API response
  }
}
```

If you format your API response in the following way, `analytics` will be pushed to `window.dataLayer` automatically. When a `payload` object is present in the response, only the content of `payload` will be returned from `api.execute`.

---

### 🖼️ Include responsive images helper?
If you select this, `source/js/responsive-images.js` and `source/components/image` will be included. `source/components/fluid-image` will also work with this. These are intended to be used with the image resizer plugin to EPiServer. `responsive-images.js` measures images and returns a URL to a resized image. The `Image` and `FluidImage` components do the same thing on mount.

---

### ☢️ Use inline SVG icons in React?
If you select this, `source/components/icon` and `source/assets/icons/icons.js` will be included, as well as some npm packages. The `Icon` component will render an svg inline. You use it by putting SVG files in `source/assets/icons` and referencing use the filename as `name` to the `Icon` component:

```jsx
<Icon name="my-icon" /> // Renders source/assets/icons/my-icon.svg inline
```

---

## Scripts
Included is a couple of utility scripts for lazy people. You can use these from the terminal or within VS Code if you use that.

### Create new component

`yarn component component-name` creates the folder `source/components/component-name` and puts `component-name.jsx`, `component-name.scss` and `index.js` inside it. Sweeeeeet 🤩. You do need to restart webpack dev server in order for the `scss` file to be included.

---

### Create new mockup page
Works much like the above script, but does not create a `.scss` file and creates a `.json` file for mockup data instead. Usage: `yarn mockup page-name`. You need to restart webpack dev server in order for the new page to show up on the front page of the mockup.

---

### Rename component
`yarn rename old-name new-name`. This will rename the component folder, all of the files, and all css class names.

---

### Convert component to stateless
`yarn to-stateless component-name` Will convert `source/components/component-name` to a stateless component if it can. These things need to happen before you can convert:

* Remove all lifecycle methods
* Remove all references to `this.state`
* Remove all refs

You can usually tell if a component can be converted to stateless by the eslint warning saying that it should be converted to stateless.

---

### Convert component to stateful
`yarn to-stateful component-name` Will convert `source/components/component-name` to a stateful component.

## VS Code tasks
If you're using VS Code, you can run the above scripts from within the editor. Running tasks this way is nice because `rename`, `to-stateful` and `to-stateless` will not require any typing if you already have the file you want to convert/rename open in your editor.

Open the Command Pallette (`View -> Command Pallette`) or `⇧⌘P`, type `run task` and select `Tasks: Run Task`. Then, start typing the name of the script you want to run, like `rename` or `component` and press return when you see the right one. This will open a terminal window inside Code, which can be closed by pressing any key once the script has finished.

If you want to run the scripts from within Code, it's a good idea to map the `Run Task` command to a keyboard shortcut, to avoid excessive typing.

## Assets
Put your assets like fonts, icons and logos in `source/assets`. Mockup content assets can be put in `source/mockup/assets`. Webpack copies everything from `source/mockup/assets` to `/mockup/assets`, so you can refer to your mockup files like this:

```json
{
  "imageUrl": "/mockup/assets/my-image.jpg"
}
```

## Mocking API responses
Webpack will copy everything from `source/mockup/api` to `/mockup/api` you can reference your mock API responses like this:

```json
{
  "apiEndpoint": "/mockup/api/register-user.json"
}
```