import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './static-site/app';
import Routes from './static-site/routes';

export default ({ isProduction, path, webpackStats }) => {
  const files = Object.keys(webpackStats.compilation.assets);
  const css = files.filter(value => value.match(/\.css$/));
  const js = files
    .filter(
      value =>
        value.match(/\.js$/) &&
        (value.includes('client') || value.includes('vendor'))
    )
    .sort()
    .reverse();
  const context = {};

  return `<!doctype html>${ReactDOMServer.renderToString(
    <App css={css} js={js} shouldIncludeWebpackDevServerJs={!isProduction}>
      <StaticRouter context={context} location={path}>
        <Routes />
      </StaticRouter>
    </App>
  )}`;
};
