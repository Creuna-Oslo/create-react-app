import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

const FluidImage = ({ alt, className, focusPoint, src }) =>
  !src ? null : (
    <div
      className={cn('fluid-image', className)}
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: focusPoint
          ? `${focusPoint.x}% ${focusPoint.y}%`
          : null
      }}
    >
      <img src={src} alt={alt} />
    </div>
  );

FluidImage.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  focusPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  src: PropTypes.string
};

export default FluidImage;
