const paths = require('../../config/paths');
const fs = require('fs');
const path = require('path');
const theme = require(paths.appPackageJson).theme;

function getTheme() {
  const themeType = typeof theme;
  if(themeType === 'string') {
    const themeFilePath = path.join(paths.appPath, theme);
    if (fs.existsSync(themeFilePath)) {
      return require(themeFilePath);
    } else {
      throw new Error(`theme file: ${themeFilePath} does not exist.`)
    } 
  } else if (themeType=== 'object' && theme !== null) {
    return theme;
  } else if (themeType === 'undefined') {
    return undefined;
  } else {
    throw new Error(`theme field in package.json should be a string or a plain object. But got ${themeType}`)
  }
} 

module.exports = getTheme;