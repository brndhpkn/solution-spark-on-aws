require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@amzn/workbench-core-eslint-custom'],
  parserOptions: { tsconfigRootDir: __dirname }
};
