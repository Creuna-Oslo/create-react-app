import { expect } from 'chai';

// 'describe' and 'it' are globals provided by Mocha (https://mochajs.org/)
describe('Example test', () => {
  it('renders link', () => {
    // 'browser' is a global provided by WebdriverIO (http://webdriver.io/api.html)
    browser.url('http://localhost:8080');
    expect(browser.getText('a')).to.equal('eksempelside');
  });

  it('navigates to sample page', () => {
    browser.click('a');
    // It's smart to use data attributes to target elements so that you don't accidentally break tests when renaming css class names or tag names.
    expect(browser.getText('[data-title]')).to.equal('Hey 🕶');
  });

  it('detects input method', () => {
    expect(browser.getAttribute('html', 'class')).to.equal('');
    browser.click('[data-title]');
    expect(browser.getAttribute('html', 'class')).to.equal(
      'mouse-user no-touchevents'
    );
  });

  it('navigates back to front page', () => {
    browser.click('[data-back-button]');
    expect(browser.getUrl()).to.equal('http://localhost:8080/');
  });
});
