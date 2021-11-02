const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const optimization = () => {
  const config = {minimize: false}
  if (isProd){
    config.minimize = true;
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          keep_classnames: true,
          keep_fnames: true,
        },
        extractComments: false,
      })
    ];
  }
  return config;
}

module.exports = {
  mode: 'production',// development production
  entry: {
    headerScripts: './js/header.js',
    footerScripts: './js/footer.js',
    blogScripts: './js/blog.js',
    adminScripts: './js/admin.js',
  },
//   resolve: {
//     alias: {
//       '@plugins' : path.resolve(__dirname, '../../plugins')
//     }
//   },
  context: path.resolve(__dirname, "assets"),
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, "assets/min/js"),
    assetModuleFilename: isDev ? '../img/[name]-[hash][ext]' : '../img/[hash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(mjs|jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)/,
        type: 'asset',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../img/',
            },
          },
          'css-loader', 'postcss-loader', 'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset/resource',
      },
      //Подтягиваем SVG в CSS файлах в строку
      {
        test: /\.svg/,
        type: isDev ? 'asset/resource' : 'asset/inline',
        generator: isDev ? {} : {
          dataUrl: content => {
            content = content.toString();
            return svgToMiniDataURI(content);
          }
        }
      }
    ]
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        let fN = pathData.chunk.name;
        switch (fN){
          case 'blogScripts' : return `../css/blog.min.css`;
          case 'adminScripts' : return `../css/admin.min.css`;
          default : return `../css/style.min.css`;
        }
      },
    }),
    new LodashModuleReplacementPlugin,
  ],
  optimization: optimization(),
};