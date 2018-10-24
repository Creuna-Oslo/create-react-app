import React from 'react';
import { Route, Switch } from 'react-router-dom';

import pages from './pages/pages';

const Routes = () => (
  <Switch>
    {pages.map(page => (
      <Route exact key={page.path} {...page} />
    ))}
  </Switch>
);

export default Routes;
