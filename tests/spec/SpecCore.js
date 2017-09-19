(function () {
    describe("Not-jquery object", function () {

        it("should be in window", function () {
            expect(nj).toBeType('function');
        });

        it("should contain 'ajax' function", function () {
            expect(nj.ajax).toBeType('function');
        });

        it("should contain 'create' function", function () {
            expect(nj.create).toBeType('function');
        });

        it("should contain 'proto' object", function () {
            expect(nj.proto).toBeObject();
        });

        it("should contain version number", function () {
            expect(nj.version).toBeDefined();
        });

        it("should return object-like array", function () {
            expect(nj()).toBeObject();
            expect(nj().length).toBeType('number');
            expect(nj().forEach).toBeType('function');
            expect(nj().slice).toBeType('function');
            expect(nj().push).toBeType('function');
        });

        it("should be extensible", function () {
            expect(nj().newMethod).toBeUndefined();

            var spy = jasmine.createSpy('spy');

            nj.proto.newMethod = spy;
            expect(nj().newMethod).toBeType('function');

            nj().newMethod();
            expect(spy).toHaveBeenCalled();
        });

    });


    describe("Not-jquery should call the passed function", function () {
        var spy;
        beforeEach(function () {
            spy = jasmine.createSpy('spy');
            nj(spy);
        });

        it("when DOM is ready", function () {
            expect(spy).toHaveBeenCalled();
        });

        it("with the 'document' context", function () {
            expect(spy.calls.all()).toEqual([{object: document, args: [], returnValue: undefined}]);
        });

    });
})();