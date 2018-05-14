/*eslint no-unused-vars: 0*/
import get from 'lodash/get';
import merge from 'lodash/merge';

import isRunningOnClient from '@creuna/utils/is-running-on-client';
import stripUndefined from '@creuna/utils/strip-undefined';
import tryParseJson from '@creuna/utils/try-parse-json';

/* NOTE: Implement Google Tag Manager for this module to work correctly

  Step 1
  Copy the following JavaScript and paste it as close to the opening <head> tag as possible on every page of your website
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

  Step 2
  Copy the following snippet and paste it immediately after the opening <body> tag on every page of your website
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none visibility:hidden"></iframe></noscript>
*/

// NOTE: See https://docs.google.com/spreadsheets/d/1Q5eLVcFdGxVhnz-17I_V77QQeCZPPum7PwAeuMkwFms/ for the initial/incomplete/confusing tracking spec.

function Timeout(fn, delay) {
  const id = setTimeout(() => {
    this.clear();
    fn();
  }, delay);

  this.cleared = false;
  this.clear = () => {
    this.cleared = true;
    clearTimeout(id);
  };
}

function getCallbackEnhancedData(data, callback) {
  if (typeof callback !== 'function') {
    return data;
  }

  // NOTE: The timeout will call the callback after the delay unless eventCallback is called first, clearing the timeout.
  // This ensures that the callback will be called even if GTM is unavailable or can't handle the event fast enough.
  const callbackTimeout = new Timeout(callback, 300);

  return Object.assign({}, data, {
    eventCallback: () => {
      if (!callbackTimeout.cleared) {
        callbackTimeout.clear();
        callback();
      }
    }
  });
}

function send(data, callback) {
  if (!data || !isRunningOnClient) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  if (data.length) {
    data.forEach(dataObject => {
      window.dataLayer.push(getCallbackEnhancedData(dataObject, callback));
    });
  } else {
    window.dataLayer.push(getCallbackEnhancedData(data, callback));
  }
}

export default {
  send
};
