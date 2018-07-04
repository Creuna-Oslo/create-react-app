// Options for tests

module.exports = function(projectPath) {
  const baseOptions = {
    authorEmail: 'john.doe@email.com',
    authorName: 'John Doe',
    projectName: 'my-project',
    projectPath
  };

  return {
    allModules: Object.assign({}, baseOptions, {
      useApiHelper: true,
      useAnalyticsHelper: true,
      useMessenger: true,
      useResponsiveImages: true
    }),
    noModules: Object.assign({}, baseOptions, {
      useApiHelper: false,
      useAnalyticsHelper: false,
      useMessenger: false,
      useResponsiveImages: false
    })
  };
};
