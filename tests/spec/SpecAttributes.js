(function () {
    var el, el2, el3, $nj, $res, $res2, inner1, inner2;

    var before = function before() {
        el = document.createElement('div');
        el2 = document.createElement('b');
        el3 = document.createElement('b');
        el.appendChild(el2);
        el.appendChild(el3);
    };

    var findAttr = function findAttr(arr, name) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].name === name) {
                return arr[i].value;
            }
        }
    };

    describe("'html' method", function () {

        inner1 = ' <span>1</span> ';
        inner2 = '<strong>2</strong><span>3</span>';
        beforeEach(before);

        it("should return an array of elements 'html' contents", function () {
            el2.innerHTML = inner1;
            el3.innerHTML = inner2;

            $nj = nj(el).find('b');
            $res = $nj.html();

            expect($res[0]).toBe(inner1);
            expect($res[1]).toBe(inner2);
            expect($res.length).toBe(2);
        });

        it("should return a string instead of an array when only one element matches the selector", function () {
            el.innerHTML = inner1;

            $nj = nj(el);
            $res = $nj.html();

            expect(typeof $res).toBe('string');
            expect($res).toBe(inner1);
        });

        it("should return 'undefined' if no one element matches the selector", function () {
            $nj = nj(el).find('nothing');
            $res = $nj.html();

            expect($res).toBeUndefined();
        });

        it("should set elements' 'html' content if called with the parameter", function () {
            $nj = nj(el).find('b').html(inner2);
            $res = el2.innerHTML;
            $res2 = el3.innerHTML;

            expect($res).toBe(inner2);
            expect($res2).toBe(inner2);
        });

        it("should return all prototypes", function () {
            $res = nj(el).html('');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe("'text' method", function () {

        var text1 = 'text';
        var text2 = 'textandanother text';
        inner1 = '<span> text </span>';
        inner2 = '<strong>text</strong>and<span>another text</span>';
        beforeEach(before);

        it("should return an array of elements 'text' contents", function () {
            el2.innerHTML = inner1;
            el3.innerHTML = inner2;

            $nj = nj(el).find('b');
            $res = $nj.text();

            expect($res[0]).toBe(text1);
            expect($res[1]).toBe(text2);
            expect($res.length).toBe(2);
        });

        it("should return a string instead of an array when only one element matches the selector", function () {
            el.innerHTML = inner1;

            $nj = nj(el);
            $res = $nj.text();

            expect(typeof $res).toBe('string');
            expect($res).toBe(text1);
        });

        it("should return 'undefined' if no one element matches the selector", function () {
            $nj = nj(el).find('nothing');
            $res = $nj.text();

            expect($res).toBeUndefined();
        });

        it("should set elements' 'text' content if called with the parameter", function () {
            $nj = nj(el).find('b').text(text2);
            $res = el2.innerHTML;
            $res2 = el3.innerHTML;

            expect($res).toBe(text2);
            expect($res2).toBe(text2);
        });

        it("should return all prototypes", function () {
            $res = nj(el).text('');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe("'attr' method", function () {

        beforeEach(before);
        beforeEach(function () {
            el.setAttribute('test', 'val');
            el.setAttribute('test2', 2);
            el2.setAttribute('test3', 'val3');
            el3.setAttribute('test4', 'val4');
        });

        it("should return an array of attributes objects", function () {
            $nj = nj(el).find('b');
            $res = $nj.attr();

            expect($res[0]).toEqual({test3: 'val3'});
            expect($res[1]).toEqual({test4: 'val4'});
            expect($res.length).toBe(2);
        });

        it("should return an array of attributes values if called with the parameter", function () {
            $nj = nj(el).find('b');
            $res = $nj.attr('test3');
            $res2 = $nj.attr('test4');

            expect($res[0]).toEqual('val3');
            expect($res[1]).toEqual(null);
            expect($res.length).toBe(2);
            expect($res2[0]).toEqual(null);
            expect($res2[1]).toEqual('val4');
            expect($res2.length).toBe(2);
        });

        it("should return an object or value instead of an array when only one element matches the selector", function () {
            $nj = nj(el);
            $res = $nj.attr();
            $res2 = $nj.attr('test2');

            expect($res).toEqual({test: 'val', test2: 2});
            expect($res2).toBe(2);
        });

        it("should return 'undefined' if no one element matches the selector", function () {
            $nj = nj(el).find('nothing');
            $res = $nj.attr();

            expect($res).toBeUndefined();
        });

        it("should set element's attributes values if called with the second parameter", function () {
            $nj = nj(el).find('b').attr('test5', 'val5');
            $res = el2.attributes;
            $res2 = el3.attributes;

            expect($res.length).toBe(2);
            expect(findAttr($res, 'test3')).toBe('val3');
            expect(findAttr($res, 'test5')).toBe('val5');
            expect($res2.length).toBe(2);
            expect(findAttr($res2, 'test4')).toBe('val4');
            expect(findAttr($res2, 'test5')).toBe('val5');
        });

        it("should return all prototypes", function () {
            $res = nj(el).attr('a', 'b');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe("'data' method", function () {

        beforeEach(before);
        beforeEach(function () {
            el.setAttribute('data-test', 'val');
            el.setAttribute('data-test2', 2);
            el.setAttribute('data-test-with-camel-case', true);
            el.setAttribute('not-data', 'yep');
            el2.setAttribute('data-test3', 'val3');
            el2.setAttribute('not-data', 'yep');
            el3.setAttribute('data-test4', 'val4');
            el3.setAttribute('not-data', 'yep');
        });

        it("should return an array of 'data' attributes objects", function () {
            $nj = nj(el).find('b');
            $res = $nj.data();

            expect($res[0]).toEqual({test3: 'val3'});
            expect($res[1]).toEqual({test4: 'val4'});
            expect($res.length).toBe(2);
        });

        it("should return an array of 'data' attributes values if called with the 'string' parameter", function () {
            $nj = nj(el).find('b');
            $res = $nj.data('test3');
            $res2 = $nj.data('test4');

            expect($res[0]).toEqual('val3');
            expect($res[1]).toEqual(null);
            expect($res.length).toBe(2);
            expect($res2[0]).toEqual(null);
            expect($res2[1]).toEqual('val4');
            expect($res2.length).toBe(2);
        });

        it("should return an object or value instead of an array when only one element matches the selector", function () {
            $nj = nj(el);
            $res = $nj.data();
            $res2 = $nj.data('test2');

            expect($res).toEqual({test: 'val', test2: 2, testWithCamelCase: true});
            expect($res2).toBe(2);
        });

        it("should return 'undefined' if no one element matches the selector", function () {
            $nj = nj(el).find('nothing');
            $res = $nj.data();

            expect($res).toBeUndefined();
        });

        it("should set element's 'data' attributes values if called with the 'object' parameter", function () {
            $nj = nj(el).find('b').data({testWithSet: 5, hop: 'hey'});
            $res = el2.attributes;
            $res2 = el3.attributes;

            expect($res.length).toBe(4);
            expect(findAttr($res, 'data-test3')).toBe('val3');
            expect(findAttr($res, 'not-data')).toBe('yep');
            expect(findAttr($res, 'data-test-with-set')).toBe('5');
            expect(findAttr($res, 'data-hop')).toBe('hey');
            expect($res2.length).toBe(4);
            expect(findAttr($res2, 'data-test4')).toBe('val4');
            expect(findAttr($res2, 'not-data')).toBe('yep');
            expect(findAttr($res2, 'data-test-with-set')).toBe('5');
            expect(findAttr($res2, 'data-hop')).toBe('hey');
        });

        it("should return all prototypes", function () {
            $res = nj(el).data({a: 1});
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe("'removeAttr' method", function () {

        beforeEach(before);
        beforeEach(function () {
            el2.setAttribute('test3', 'val3');
            el2.setAttribute('test5', 'val5');
            el3.setAttribute('test4', 'val4');
            el3.setAttribute('test6', 'val6');
        });

        it("should remove specified attribute", function () {
            $nj = nj(el).find('b');

            $nj.removeAttr('test3');
            $res = el2.attributes;
            $res2 = el3.attributes;

            expect($res.length).toBe(1);
            expect(findAttr($res, 'test5')).toBe('val5');
            expect($res2.length).toBe(2);


            $nj.removeAttr('test6');
            expect($res.length).toBe(1);
            expect(findAttr($res, 'test5')).toBe('val5');
            expect($res2.length).toBe(1);
            expect(findAttr($res2, 'test4')).toBe('val4');
        });

        it("should return all prototypes", function () {
            $res = nj(el).removeAttr('attr');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe("'removeData' method", function () {

        beforeEach(before);
        beforeEach(function () {
            el2.setAttribute('data-test3', 'val3');
            el2.setAttribute('data-test5', 'val5');
            el3.setAttribute('test4', 'val4');
            el3.setAttribute('data-test-with-camel-case', 'val6');
        });

        it("should remove specified 'data' attribute", function () {
            $nj = nj(el).find('b');

            $nj.removeData('test3');
            $res = el2.attributes;
            $res2 = el3.attributes;

            expect($res.length).toBe(1);
            expect(findAttr($res, 'data-test5')).toBe('val5');
            expect($res2.length).toBe(2);


            $nj.removeData('testWithCamelCase');
            expect($res.length).toBe(1);
            expect(findAttr($res, 'data-test5')).toBe('val5');
            expect($res2.length).toBe(1);
            expect(findAttr($res2, 'test4')).toBe('val4');
        });

        it("should return all prototypes", function () {
            $res = nj(el).removeData('dat');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });
})();