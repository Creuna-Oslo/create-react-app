import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

import App from './mockup/app';
import Routes from './mockup/routes';

import inputDetection from 'js/input-detection';

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <BrowserRouter>
      <Routes />
    </BrowserRouter>,
    document.getElementById('mount-point')
  );

  inputDetection.activate();
}

export default ({ path, webpackStats }) => {
  const files = Object.keys(webpackStats.compilation.assets);
  const css = files.filter(value => value.match(/\.css$/));
  const js = files.filter(
    value => value.match(/\.js$/) && value.includes('static')
  );
  const context = {};

  return `<!doctype html>${ReactDOMServer.renderToString(
    <App css={css} js={js}>
      <StaticRouter context={context} location={path}>
        <Routes />
      </StaticRouter>
    </App>
  )}`;
};
