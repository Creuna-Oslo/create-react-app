import React from 'react';
import PropTypes from 'prop-types';

const App = ({ children, css, js, shouldIncludeWebpackDevServerJs, title }) => (
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
      {shouldIncludeWebpackDevServerJs && (
        <script src="/webpack-dev-server.js" />
      )}
      <title>{title}</title>
    </head>
    <body>
      <div id="mount-point">{children}</div>
      {js.map((file, index) => (
        <script key={index} src={`/${file}`} />
      ))}
    </body>
  </html>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  css: PropTypes.array,
  js: PropTypes.array,
  shouldIncludeWebpackDevServerJs: PropTypes.bool,
  title: PropTypes.string
};

App.defaultProps = {
  css: [],
  js: []
};

export default App;
