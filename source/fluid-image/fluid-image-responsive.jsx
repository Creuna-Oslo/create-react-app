import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

import ImageLoader from '../../js/responsive-images';

class FluidImage extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    focusPoint: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    initialSize: PropTypes.number,
    src: PropTypes.string
  };

  static defaultProps = {
    initialSize: 200
  };

  state = {
    src: this.props.src + `?transform=DownFit&width=${this.props.initialSize}`
  };

  componentDidMount() {
    if (this.container) {
      this.setState({
        src: ImageLoader.getNewSrc(
          this.props.src,
          this.container.offsetWidth,
          this.props.initialSize
        )
      });
    }
  }

  render() {
    return !this.props.src ? null : (
      <div
        className={cn('fluid-image', this.props.className)}
        style={{
          backgroundImage: `url(${this.state.src})`,
          backgroundPosition: this.props.focusPoint
            ? `${this.props.focusPoint.x}% ${this.props.focusPoint.y}%`
            : null
        }}
        ref={div => (this.container = div)}
      >
        <img src={this.state.src} alt={this.props.alt} />
      </div>
    );
  }
}

export default FluidImage;
