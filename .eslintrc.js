module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,  //定义函数名的时候 括号旁边不需要空格
    'indent': 0  //忽略缩进
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
