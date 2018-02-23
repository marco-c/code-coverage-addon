module.exports = {
    "globals": {
        "document": true,
        "window": true,
        "MutationObserver": true,
        "requestIdleCallback": true,
        "waitIdle": true,
        "wait": true,
        "fetch": true,
        "fetchCoverage": true,
        "fetchAnnotate": true,
        "fetchChangesetCoverage": true,
        "isCoverageSupported": true,
        "injectToggle": true,
        "getPath": true,
        "gitToHg": true,
        "getNavigationPanel": true,
        "SUPPORTED_EXTENSIONS": true
    },
    "env": {
        "es6": true,
        "node": true,
        "webextensions": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            "warn",
            "all"
        ],
        "no-constant-condition": [
            "warn"
        ],
        "no-console": "off"
    }
};