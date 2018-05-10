import classListPolyfill from './polyfills/class-list';

/* NOTE: https://www.html5rocks.com/en/mobile/touchandmouse/
  First, you have to be careful when designing more advanced touch interactions:
  when the user uses a mouse it will respond via a click event, but when the user
  touches the screen both touch and click events will occur.

  For a single click the order of events is:

  1. touchstart
  2. touchmove
  3. touchend
  4. mouseover
  5. mousemove
  6. mousedown
  7. mouseup
  8. click
*/

function activate() {
  let touchEndHappened = false;

  classListPolyfill.activate();

  const onMouseDown = () => {
    if (touchEndHappened) {
      return;
    }

    document.documentElement.classList.add('mouse-user');
    document.documentElement.classList.add('no-touchevents');
    document.documentElement.classList.remove('touchevents');
  };

  const onTouchEnd = () => {
    touchEndHappened = true;
    setTimeout(() => {
      touchEndHappened = false;
    }, 100);
  };

  const onTouchStart = () => {
    document.documentElement.classList.add('mouse-user');
    document.documentElement.classList.add('touchevents');
    document.documentElement.classList.remove('no-touchevents');
  };

  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('mousedown', onMouseDown);

  const keyCodeWhiteList = [9, 33, 34, 35, 36, 37, 38, 39, 40];

  document.addEventListener('keydown', e => {
    if (keyCodeWhiteList.indexOf(e.which) !== -1) {
      document.documentElement.classList.remove('mouse-user');
    }
  });
}

export default {
  activate
};
