function handleAnalytics({ json, response }) {
  if (json.analytics) {
    analytics.send(json.analytics);
  }

  return { json, response };
}
