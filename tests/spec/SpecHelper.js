beforeEach(function () {
    jasmine.addMatchers({
        toBeType: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: typeof actual === expected
                    };
                }
            };
        },
        toBeObject: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: typeof actual === 'object'
                    };
                }
            };
        }
    });
});
