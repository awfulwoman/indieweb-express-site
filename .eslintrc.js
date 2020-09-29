module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
    },
    "plugins": [
        "security"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:security/recommended"
    ]
};
