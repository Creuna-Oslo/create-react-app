const { sep } = require('path');

module.exports = (
  { useAnalyticsHelper, useMessenger, useResponsiveImages },
  src
) => {
  const isAnalyticsFile = src.includes(`js${sep}analytics.js`);
  const isMessengerFile =
    src.includes(`js${sep}messenger.js`) ||
    src.includes(`components${sep}message`);
  const isImageFile =
    src.includes(`components${sep}image`) ||
    src.includes(`components${sep}fluid-image`) ||
    src.includes(`js${sep}responsive-images.js`);

  if (isAnalyticsFile) {
    return useAnalyticsHelper;
  }

  if (isMessengerFile) {
    return useMessenger;
  }

  if (isImageFile) {
    return useResponsiveImages;
  }

  return true;
};
