//$analyticsImport
//$messengerImport

const defaultFetchOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};

function parseResponse(response) {
  return response.json().then(json => ({ json, response }));
}

//$handleMessage

//$handleAnalytics

function handleNotOk({ json, response }) {
  // NOTE: `response.ok` is true when the returned status is in the inclusive range 200-299.
  if (!response.ok && !json.messageToUser) {
    const error = new Error(response.statusText);

    error.name = `${response.status} on ${response.url}`;

    throw error;
  }

  return { json, response };
}

function handleResponse({ json }) {
  return json.payload || json;
}

function handleFetchError(error) {
  //$messengerFetchError

  return Promise.reject(error);
}

function request(url, options) {
  return fetch(url, options)
    .then(parseResponse) //$callMessageHandler //$callAnalyticsHandler
    .then(handleNotOk)
    .then(handleResponse)
    .catch(handleFetchError);
}

function post(endpoint, data) {
  return request(
    endpoint,
    Object.assign({}, defaultFetchOptions, {
      body: data,
      method: 'post'
    })
  );
}

function get(endpoint) {
  return request(endpoint, defaultFetchOptions);
}

function execute(endpoint, data) {
  if (endpoint.indexOf('/static/api') !== -1) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(request(endpoint, defaultFetchOptions));
      }, 1000);
    });
  }

  return post(endpoint, JSON.stringify(data));
}

export default {
  execute,
  get
};
