function handleUserMessages({ json, response }) {
  if (json.messageToUser) {
    if (json.success) {
      messenger.sendMessage({ message: json.messageToUser });
    } else {
      messenger.sendErrorMessage({ message: json.messageToUser });
    }
  }

  return { json, response };
}
