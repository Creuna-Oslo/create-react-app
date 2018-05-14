var transformBase = '?transform=DownFit&width=';
var breakpointResolution = 100;

function getNewSrc(originalSrc, imageNodeWidth, currentImageWidth = 0) {
  var adjustedWidth = imageNodeWidth * (window.devicePixelRatio || 1);

  // Return image resized up to closest 100px relative to imageNodeWidth
  return (
    originalSrc +
    transformBase +
    (adjustedWidth > currentImageWidth
      ? Math.ceil(adjustedWidth / breakpointResolution) * breakpointResolution
      : currentImageWidth)
  );
}

export default {
  getNewSrc
};
