import PubSub from 'pubsub-js';

const errorMessageTopic = 'error-message';
const messageTopic = 'message';

function onTopic(topic, func) {
  if (typeof func !== 'function') {
    return;
  }

  return PubSub.subscribe(topic, (topic, { message }) => {
    func({ message });
  });
}

function send(topic, { message }) {
  PubSub.publish(topic, { message });
}

const onErrorMessage = func => onTopic(errorMessageTopic, func);

const onMessage = func => onTopic(messageTopic, func);

const sendErrorMessage = ({ message }) => send(errorMessageTopic, { message });

const sendMessage = ({ message }) => send(messageTopic, { message });

export default {
  onErrorMessage,
  onMessage,
  sendErrorMessage,
  sendMessage
};
