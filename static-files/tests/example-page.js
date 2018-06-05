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
    expect(browser.getText('h1')).to.equal('Hey 🕶');
  });

  it('detects input method', () => {
    expect(browser.getAttribute('html', 'class')).to.equal('');
    browser.click('h1');
    expect(browser.getAttribute('html', 'class')).to.equal(
      'mouse-user no-touchevents'
    );
  });

  it('navigates back to front page', () => {
    browser.back();
    expect(browser.getUrl()).to.equal('http://localhost:8080/');
  });
});
