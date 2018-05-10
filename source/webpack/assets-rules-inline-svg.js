{
  test: /\.(svg|png|jpg|woff2?|ttf|eot)$/,
  exclude: [path.resolve(__dirname, './source/assets/icons')],
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[hash].[ext]'
    }
  }
},
{
  test: /\.svg$/,
  include: [path.resolve(__dirname, './source/assets/icons')],
  use: [
    { loader: 'svg-react-loader' },
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          { removeViewBox: false },
          { removeAttrs: { attrs: '(class|fill|data-name|id)' } }
        ]
      }
    }
  ]
}