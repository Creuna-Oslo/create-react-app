import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

import messenger from 'js/messenger';

class Message extends React.Component {
  static propTypes = {
    isErrorMessage: PropTypes.bool,
    text: PropTypes.string
  };

  state = {
    isErrorMessage: this.props.isErrorMessage,
    isVisible: false,
    text: this.props.text
  };

  show = ({ message, isErrorMessage }) => {
    this.setState(
      { isVisible: !!message, isErrorMessage, text: message },
      () => {
        if (!this.state.isErrorMessage) {
          setTimeout(() => {
            this.hide();
          }, 3000);
        }
      }
    );
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  componentDidMount() {
    if (this.props.text) {
      this.setState({ isVisible: true });
    }

    messenger.onErrorMessage(({ message }) => {
      this.show({ message, isErrorMessage: true });
    });

    messenger.onMessage(({ message }) => {
      this.show({ message, isErrorMessage: false });
    });
  }

  render() {
    return (
      this.state.isVisible && (
        <div
          className={cn('message', {
            'is-error': this.state.isErrorMessage
          })}
        >
          <p>{this.state.text}</p>
          {this.state.isErrorMessage && (
            <button className="message-close" onClick={this.hide} />
          )}
        </div>
      )
    );
  }
}

export default Message;
