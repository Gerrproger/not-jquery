describe("F4ck-jquery object", function () {

    it("should be in window", function () {
        expect(f4).toBeType('function');
    });

    it("should contain 'ajax' function", function () {
        expect(f4.ajax).toBeType('function');
    });

    it("should contain 'create' function", function () {
        expect(f4.create).toBeType('function');
    });

    it("should contain 'proto' object", function () {
        expect(f4.proto).toBeObject();
    });

    it("should contain version number", function () {
        expect(f4.version).toBeDefined();
    });

    it("should return object-like array", function () {
        expect(f4()).toBeObject();
        expect(f4().length).toBeType('number');
        expect(f4().forEach).toBeType('function');
        expect(f4().slice).toBeType('function');
        expect(f4().push).toBeType('function');
    });

    it("should be extensible", function () {
        expect(f4().newMethod).toBeUndefined();

        var spy = jasmine.createSpy('spy');

        f4.proto.newMethod = spy;
        expect(f4().newMethod).toBeType('function');

        f4().newMethod();
        expect(spy).toHaveBeenCalled();
    });

});


describe("F4ck-jquery should call the passed function", function () {
    var spy;
    beforeEach(function () {
        spy = jasmine.createSpy('spy');
        f4(spy);
    });

    it("when DOM is ready", function () {
        expect(spy).toHaveBeenCalled();
    });

    it("with the 'document' context", function () {
        expect(spy.calls.all()).toEqual([{object: document, args: [], returnValue: undefined}]);
    });

});
