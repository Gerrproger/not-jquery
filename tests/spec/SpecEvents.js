(function () {
    var event1 = document.createEvent('Event');
    event1.initEvent('test1', true, false);
    var event2 = document.createEvent('Event');
    event2.initEvent('test2', true, false);
    var eventTransition = document.createEvent('CustomEvent');
    eventTransition.initCustomEvent('transitionend', true, false, {
        propertyName: 'width',
        pseudoElement: '::after'
    });
    var el, el2, el3, spy, spy2, spy3, $f4;
    var before = function before() {
        spy = jasmine.createSpy('spy');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
        el = document.createElement('div');
        el2 = document.createElement('b');
        el3 = document.createElement('b');
        el.appendChild(el2);
        el.appendChild(el3);
    };
    var oldTransitionEnd = f4.proto.transitionEnd;
    var modifyProto = function  modifyProto(){
        var newTransitionEnd = f4.proto.transitionEnd.toString()
            .replace(/ev.propertyName/, 'ev.detail.propertyName')
            .replace(/ev.pseudoElement/, 'ev.detail.pseudoElement');
        f4.proto.transitionEnd = new Function('return ' + newTransitionEnd + '.apply(this, arguments);');
    };

    var resetProto = function resetProto(){
        f4.proto.transitionEnd = oldTransitionEnd;
    };

    describe("'on' method", function () {

        beforeEach(before);

        it("should call the function on the event", function () {
            f4(el).on('test1', spy);
            f4(el).on('test1', spy2);
            f4(el).on('test1', spy3, 'test');

            el.dispatchEvent(event1);
            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(spy3).toHaveBeenCalled();
        });

        it("should call the function with 'event' argument", function () {
            f4(el).on('test1', spy);

            el.dispatchEvent(event1);
            expect(spy.calls.first().args[0] instanceof Event).toBe(true);
            expect(spy.calls.first().object).toBe(el);
        });

        it("should call the function each time the event fires", function () {
            f4(el).on('test1', spy);

            el.dispatchEvent(event1);
            el.dispatchEvent(event1);
            el.dispatchEvent(event1);
            el.dispatchEvent(event1);
            expect(spy).toHaveBeenCalledTimes(4);
        });

        it("should work with different events", function () {
            f4(el).on('test1', spy);
            f4(el).on('test2', spy2);

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            el.dispatchEvent(event2);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(2);
        });

        it("should work with multiple elements", function () {
            f4(el).on('test1', spy).find('b').on('test1', spy2);

            el2.dispatchEvent(event1);
            el3.dispatchEvent(event1);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(2);
        });

        it("should return all prototypes", function () {
            $f4 = f4(el).on('click', spy);
            Object.keys(f4.proto).forEach(function (name) {
                expect($f4[name]).toBe(f4.proto[name]);
            });
        });

    });

    describe("'off' method", function () {

        beforeEach(before);

        it("should remove listener", function () {
            f4(el).on('test1', spy);
            f4(el).on('test2', spy2);
            f4(el).on('test1', spy3, 'test');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off();

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy3).toHaveBeenCalledTimes(1);
        });

        it("should remove only the specified 'event' listener", function () {
            f4(el).on('test1', spy);
            f4(el).on('test2', spy2);
            f4(el).on('test1', spy3, 'test');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test1');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy3).toHaveBeenCalledTimes(2);
        });

        it("should only remove listener of the specified 'event namespace'", function () {
            f4(el).on('test1', spy, 'n1');
            f4(el).on('test2', spy2, 'n2');
            f4(el).on('test1', spy3, 'n2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off(null, 'n1');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off(undefined, 'n2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(2);
            expect(spy3).toHaveBeenCalledTimes(2);
        });

        it("should only remove listener of the specified 'event' with the specified 'event namespace'", function () {
            f4(el).on('test1', spy, 'n1');
            f4(el).on('test2', spy2, 'n1');
            f4(el).on('test1', spy3, 'n2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('testNan', 'n1');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test1', 'n1');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test1', 'n2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test2', 'n2');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            f4(el).off('test2', 'n1');

            el.dispatchEvent(event1);
            el.dispatchEvent(event2);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(5);
            expect(spy3).toHaveBeenCalledTimes(3);
        });

        it("should work with multiple elements", function () {
            $f4 = f4(el).on('test1', spy).find('b');
            f4($f4[0]).on('test1', spy2, 'n1');
            f4($f4[1]).on('test1', spy3, 'n2');

            el2.dispatchEvent(event1);
            el3.dispatchEvent(event1);
            f4(el).off();

            el2.dispatchEvent(event1);
            el3.dispatchEvent(event1);
            f4(el).find('b').off(null, 'n1');

            el2.dispatchEvent(event1);
            el3.dispatchEvent(event1);
            f4(el).find('b').off();

            el2.dispatchEvent(event1);
            el3.dispatchEvent(event1);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(2);
            expect(spy3).toHaveBeenCalledTimes(3);
        });

        it("should return all prototypes", function () {
            $f4 = f4(el).off();
            Object.keys(f4.proto).forEach(function (name) {
                expect($f4[name]).toBe(f4.proto[name]);
            });
        });

    });

    describe("'transitionEnd' method", function () {

        beforeEach(before);
        beforeEach(modifyProto);
        afterEach(resetProto);

        it("should run the specified function on 'transitionend' event", function () {
            f4(el).transitionEnd(spy);

            el.dispatchEvent(eventTransition);
            el2.dispatchEvent(eventTransition);

            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should work with bubbling and different targets", function () {
            f4(el).transitionEnd(spy, 'all');
            f4(el2).transitionEnd(spy2, el2);
            f4(el2).transitionEnd(spy3, el3);

            el.dispatchEvent(eventTransition);
            el2.dispatchEvent(eventTransition);

            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy3).not.toHaveBeenCalled();
        });

        it("should run the specified function if the 'property name' matches the argument", function () {
            f4(el).transitionEnd(spy, null, 'height');
            f4(el).transitionEnd(spy2, null, 'width');

            el.dispatchEvent(eventTransition);

            expect(spy).not.toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });

        it("should run the specified function if the 'pseudo element' matches the argument", function () {
            f4(el).transitionEnd(spy, null, 'height', 'after');
            f4(el).transitionEnd(spy2, null, 'width', 'after');
            f4(el).transitionEnd(spy2, null, null, 'before');
            f4(el).transitionEnd(spy3, null, null, 'after');

            el.dispatchEvent(eventTransition);

            expect(spy).not.toHaveBeenCalled();
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy3).toHaveBeenCalled();
        });

        it("should work with multiple elements", function () {
            $f4 = f4(el).transitionEnd(spy);
            $f4.find('b').transitionEnd(spy2);

            el.dispatchEvent(eventTransition);
            el2.dispatchEvent(eventTransition);
            el3.dispatchEvent(eventTransition);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(2);
        });

        it("should return all prototypes", function () {
            $f4 = f4(el).transitionEnd(spy);
            Object.keys(f4.proto).forEach(function (name) {
                expect($f4[name]).toBe(f4.proto[name]);
            });
        });

    });
})();