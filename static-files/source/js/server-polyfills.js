// Not really a polyfill, but it might save some modules from crashing on the server
global.setTimeout = func => {
  if (!func) return;

  func();
};
