import PubSub from 'pubsub-js';

const errorMessageTopic = 'error-message';
const messageTopic = 'message';

function onTopic(topic, func) {
  if (typeof func !== 'function') {
    return;
  }

  return PubSub.subscribe(topic, (topic, { message, title }) => {
    func({ message, title });
  });
}

function send(topic, { message, title }) {
  PubSub.publish(topic, { message, title });
}

const onErrorMessage = func => onTopic(errorMessageTopic, func);

function off(token) {
  if (!token) {
    return;
  }

  PubSub.unsubscribe(token);
}

const onMessage = func => onTopic(messageTopic, func);

const sendErrorMessage = ({ message, title }) =>
  send(errorMessageTopic, { message, title });

const sendMessage = ({ message, title }) =>
  send(messageTopic, { message, title });

export default {
  onErrorMessage,
  off,
  onMessage,
  sendErrorMessage,
  sendMessage
};
