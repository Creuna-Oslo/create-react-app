// Options for tests

const baseOptions = {
  authorEmail: 'john.doe@email.com',
  authorName: 'John Doe',
  projectName: 'my-project',
  projectPath: 'dist'
};

module.exports = {
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
