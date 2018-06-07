import React from 'react';
import PropTypes from 'prop-types';

// This file renders the basic html pages when running the mockup
const App = ({ children, css, js }) => (
  <html>
    <head>
      {css.map((file, index) => (
        <link key={index} rel="stylesheet" href={`/${file}`} />
      ))}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <script src="/webpack-dev-server.js" />
      <title>$projectName</title>
    </head>
    <body>
      <div id="mount-point">{children}</div>
      {js.map((file, index) => <script key={index} src={`/${file}`} />)}
    </body>
  </html>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  css: PropTypes.array,
  js: PropTypes.array
};

App.defaultProps = {
  css: [],
  js: []
};

export default App;
