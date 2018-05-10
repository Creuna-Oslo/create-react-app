const req = require.context('./', true, /\.svg$/);

export default req.keys().reduce((icons, filename) => {
  const id = filename.replace('./', '').replace('.svg', '');
  return { ...icons, [id]: req(filename) };
}, {});
