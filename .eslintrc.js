const {importOrderConfig} = require('listlab-build/eslintrcConfigBuilders');

module.exports = {
  "extends": "../listlab-build/.eslintrc",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "rules": { 
    "import/order": importOrderConfig('ququmber-api'),
  }
};
