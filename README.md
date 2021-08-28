# vue-data-table

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## simple版本问题(只有最基本的配置)
# less配置
- less-loader
- css-loader
- vue-style-loader

# jsx配置  
- babel-plugin-syntax-jsx 
- babel-plugin-transform-vue-jsx 
- babel-helper-vue-jsx-merge-props
- babel-preset-env
.babelrc
- {
    "presets": ["env"],
    "plugins": ["transform-vue-jsx"]
  }
