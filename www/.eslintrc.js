module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript'
  ],
  rules: {
    indent: ['error', 2, {
      ...require('eslint-config-standard').rules.indent[2],
      flatTernaryExpressions: true,
      offsetTernaryExpressions: false
    }],
    'vue/multi-word-component-names': 'off'
  }
}
