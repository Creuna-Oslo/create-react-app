import PropTypes from 'prop-types';

const Layout = ({ children }) => children;

Layout.propTypes = {
  children: PropTypes.node
};

Layout.defaultProps = {
  children: null
};

export default Layout;
