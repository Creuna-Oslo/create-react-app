import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children, showHeader, showFooter }) => (
  <React.Fragment>
    {showHeader && <header />}
    {children}
    {showFooter && <footer />}
  </React.Fragment>
);

Layout.propTypes = {
  children: PropTypes.node,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool
};

Layout.defaultProps = {
  showHeader: true,
  showFooter: true
};

export default Layout;
