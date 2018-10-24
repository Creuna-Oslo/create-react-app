import { Selector } from 'testcafe';

fixture('Example page').page('http://localhost:8080/eksempelside');

test('Title contains "Hey"', async t => {
  await t.expect(Selector('[data-title]').textContent).contains('Hey');
});
