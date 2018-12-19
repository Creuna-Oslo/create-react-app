require('@babel/register');

const pages = require('./pages/pages.js').default;
const paths = pages.map(({ path }) => path);

module.exports = paths;
