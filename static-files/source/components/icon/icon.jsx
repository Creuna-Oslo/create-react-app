import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

import icons from '../../assets/icons/icons';

const Icon = ({ className, name }) =>
  icons[name]
    ? React.createElement(icons[name], {
        className: cn('icon', className),
        focusable: 'false'
      })
    : null;

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.oneOf(Object.keys(icons)).isRequired
};

export default Icon;
