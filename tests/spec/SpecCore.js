describe("F4ck-jquery object", function () {

    it("should be in window", function () {
        expect(typeof f4).toBe('function');
    });

    it("should contain 'ajax' function", function () {
        expect(typeof f4.ajax).toBe('function');
    });

    it("should contain 'create' function", function () {
        expect(typeof f4.create).toBe('function');
    });

    it("should contain 'proto' object", function () {
        expect(typeof f4.proto).toBe('object');
    });

    it("should contain version number", function () {
        expect(typeof f4.version).toBeDefined();
    });

    it("should return object-like array", function () {
        expect(typeof f4()).toBe('object');
        expect(typeof f4().length).toBe('number');
        expect(typeof f4().forEach).toBe('function');
        expect(typeof f4().slice).toBe('function');
        expect(typeof f4().push).toBe('function');
    });

    it("should be extensible", function () {
        expect(f4().newMethod).toBeUndefined();
        var spies = {
            newMethod: function () {
                return 'new method';
            }
        };
        spyOn(spies, 'newMethod');

        f4.proto.newMethod = spies.newMethod;
        expect(typeof f4().newMethod).toBe('function');

        f4().newMethod();
        expect(spies.newMethod).toHaveBeenCalled();
    });

});