(function () {
    var el, el2, el3, $res;

    var before = function before() {
        el = document.createElement('div');
        el2 = document.createElement('b');
        el3 = document.createElement('b');
        el.appendChild(el2);
        el.appendChild(el3);

        el.classList.add('class1');
        el.classList.add('class2');
        el2.classList.add('class3');
        el2.classList.add('class4');
        el3.classList.add('class5');
        el3.classList.add('class6');
    };

    describe('\'addClass\' method', function () {

        beforeEach(before);

        it('should add classes if called with multiple arguments', function () {
            nj(el).find('b').addClass('add1', 'add2');

            expect(el2.className).toBe('class3 class4 add1 add2');
            expect(el3.className).toBe('class5 class6 add1 add2');
        });

        it('should extract and add classes if called with single argument', function () {
            nj(el).addClass('add1 add2 add3');

            expect(el.className).toBe('class1 class2 add1 add2 add3');
        });

        it('should not add classes with existing names', function () {
            nj(el).addClass('class1', 'class7', 'class7');

            expect(el.className).toBe('class1 class2 class7');
        });

        it('should return all prototypes', function () {
            $res = nj(el).addClass('test');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'removeClass\' method', function () {

        beforeEach(before);

        it('should remove classes if called with multiple arguments', function () {
            nj(el).find('b').removeClass('class4', 'class5');

            expect(el2.className).toBe('class3');
            expect(el3.className).toBe('class6');
        });

        it('should extract and remove classes if called with single argument', function () {
            nj(el).removeClass('class1 class2');

            expect(el.className).toBe('');
        });

        it('should not remove irrelevant classes', function () {
            nj(el).removeClass('class1', 'class1', 'class5');

            expect(el.className).toBe('class2');
        });

        it('should return all prototypes', function () {
            $res = nj(el).removeClass('test');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'toggleClass\' method', function () {

        beforeEach(before);

        it('should add class if it does not exist', function () {
            nj(el).toggleClass('class8 class9');

            expect(el.className).toBe('class1 class2 class8 class9');
        });

        it('should remove existing class', function () {
            nj(el).toggleClass('class1 class2');

            expect(el.className).toBe('');
        });

        it('should work with multiple elements correct', function () {
            nj(el).find('b').toggleClass('class3', 'class6');

            expect(el2.className).toBe('class4 class6');
            expect(el3.className).toBe('class5 class3');
        });

        it('should work if called with multiple arguments', function () {
            nj(el).toggleClass('class1', 'class7');

            expect(el.className).toBe('class2 class7');
        });

        it('should return all prototypes', function () {
            $res = nj(el).toggleClass('test');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'hasClass\' method', function () {

        beforeEach(before);

        it('should return an array of results for each element', function () {
            $res = nj(el).find('b').hasClass('class4');

            expect($res.length).toBe(2);
            expect($res[0]).toBe(true);
            expect($res[1]).toBe(false);
        });

        it('should return \'true\' if all elements has specified class', function () {
            el2.classList.add('class6');

            $res = nj(el).find('b').hasClass('class6');

            expect($res).toBe(true);
        });

        it('should return \'false\' if not a single element has specified class', function () {
            $res = nj(el).find('b').hasClass('class9');

            expect($res).toBe(false);
        });

        it('should return just result (not in the array) for one element', function () {
            $res = nj(el).hasClass('class9');
            expect($res).toBe(false);

            $res = nj(el).hasClass('class1');
            expect($res).toBe(true);
        });
    });
})();