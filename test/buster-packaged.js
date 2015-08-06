var config = module.exports;

config.packaged = {
    environment: "browser",
    rootPath: "../",
    libs: [
        "node_modules/es6-promise/dist/es6-promise.js",
        "node_modules/samsam/lib/samsam.js"
    ],
    sources: [
        "pkg/sinon.js"
    ],
    testHelpers: [
        "test/test-helper.js"
    ],
    tests: [
        "test/**/*-test.js"
    ]
};
