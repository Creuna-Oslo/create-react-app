# create-react-app

React app boilerplate

[![npm version](https://img.shields.io/npm/v/@creuna/create-react-app.svg?style=flat)](https://www.npmjs.com/package/@creuna/create-react-app)

## 👩‍💻 Usage

We recommend running this from [@creuna/cli](https://github.com/Creuna-Oslo/cli).

If you want to create a new app from JavaScript, this is the right module for you.

### Dependencies

The React app relies on `node-gyp` which means you might have to install some things to get it running. Please see [node-gyp docs](https://github.com/nodejs/node-gyp#installation) for instructions for your OS if you run into trouble.

**Requires node >= 7.5.x**

## Options

### 🚀 Project name

This will be used in `package.json` as well as for `<title>` in the mockup and `<h1>` on the mockup frontpage.

---

### 😸 Your full name

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

```
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

This will push `analyticsData` to `window.dataLayer`. `send` supports both objects and arrays.

#### With API-helper

If you format your API response in the following way (or make another human do so), `analytics` will be pushed to `window.dataLayer` automatically.

```
{
  "analytics": {
    // some analytics data here
  },
  "payload": {
    //actual content of API response
  }
}
```

When a `payload` object is present in the response, only the content of `payload` will be returned from `api.execute`.

---

### 🖼️ Include responsive images helper?

If you select this the following files will be included:

- `source/js/responsive-images.js`
- `source/components/image`
- `source/components/fluid-image`

These are intended to be used with the [ImageResizer for .NET](https://imageresizing.net/) plugin. The `Image` and `FluidImage` components use `responsive-images.js` to measure the rendered images and get the URL for an image of appropriate size.

---

### ⚙️ Include VS Code tasks?

If you select this, `./.vscode/tasks.json` is included which enables you to run scripts from [@creuna/react-scripts](https://github.com/Creuna-Oslo/react-scripts) if you're using VS Code.
Running tasks this way is nice because the currently open file in Code is used as input for some of the scripts which means you can type less.

Open the Command Pallette (`View -> Command Pallette`) or `⇧⌘P`, type `run task` and select `Tasks: Run Task`. Then, start typing the name of the script you want to run, like `rename` or `component` and press Return when you see the right one. This will open a terminal window inside Code, which can be closed by pressing any key once the script has finished.

If you want to run the scripts from within Code, it's a good idea to map the `Run Task` command to a keyboard shortcut, to avoid excessive typing.
