import React from 'react';
import PropTypes from 'prop-types';

import ImageLoader from 'js/responsive-images';

class Image extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    initialSize: PropTypes.number,
    responsive: PropTypes.bool,
    src: PropTypes.string
  };

  static defaultProps = {
    initialSize: 300,
    responsive: true
  };

  state = {
    src:
      this.props.src +
      (this.props.responsive
        ? `?transform=DownFit&width=${this.props.initialSize}`
        : '')
  };

  componentDidMount() {
    const parentNode = this.image && this.image.parentElement;

    if (parentNode && this.props.responsive) {
      this.setState({
        src: ImageLoader.getNewSrc(
          this.props.src,
          parentNode.offsetWidth,
          this.props.initialSize
        )
      });
    }
  }

  render() {
    return !this.props.src ? null : (
      <img
        className="image"
        src={this.state.src}
        alt={this.props.alt}
        ref={img => (this.image = img)}
      />
    );
  }
}

export default Image;
