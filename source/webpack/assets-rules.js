{
  test: /\.(svg|png|jpg|woff2?|ttf|eot)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[hash].[ext]'
    }
  }
}