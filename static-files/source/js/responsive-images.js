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

function loadAppropriateImage(imageNodeContainer) {
  var imageNode = imageNodeContainer.getElementsByTagName('img')[0],
    src = imageNodeContainer.getAttribute('data-src');

  // Remove transforms to get precise width
  imageNodeContainer.style.transform = 'none';
  var width = imageNodeContainer.offsetWidth;
  imageNodeContainer.style.transform = '';

  var newSrc = getNewSrc(src, width);

  imageNode.setAttribute('src', newSrc);
  imageNodeContainer.style.backgroundImage = `url("${newSrc}")`;
}

function activate() {
  if (typeof window !== 'undefined' && window.document) {
    var imageNodeContainers = document.getElementsByClassName('fluid-image');
    var length = imageNodeContainers.length;

    for (var i = 0; i < length; i++) {
      loadAppropriateImage(imageNodeContainers[i]);
    }
  }
}

export default {
  activate,
  getNewSrc,
  loadAppropriateImage
};
