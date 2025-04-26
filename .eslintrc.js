const { rules } = require("eslint-config-prettier");

module.exports = {
  "extends": "@rocketseat/eslint-config/node",
  rules: {
    "no-useless-constructor": false
  }
}