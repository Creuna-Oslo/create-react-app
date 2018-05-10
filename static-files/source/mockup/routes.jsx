import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pages/home';
import pageGroups from './pages/pages';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={() => <Home pageGroups={pageGroups} />} />
    {pageGroups
      .reduce((pages, group) => pages.concat(group.pages), [])
      .map(page => (
        <Route
          exact
          path={page.url}
          component={
            typeof page.component === 'function' ? page.component : null
          }
          key={page.url}
        />
      ))}
  </Switch>
);

export default Routes;
