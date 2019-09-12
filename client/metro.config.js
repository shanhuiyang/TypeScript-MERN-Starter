const blacklist = require('metro-config/src/defaults/blacklist');

// blacklist is a function that takes an array of regexes and combines
// them with the default blacklist to return a single regex.
// We used blacklist to exclude core/node_modules for react-native project

module.exports = {
    resolver: {
        blacklistRE: blacklist([/core\/node_modules\/.*/])
    }
};