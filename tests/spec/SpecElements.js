(function () {
    describe("'find' method", function () {
        var $f4;

        it("should work when nothing is passed to the 'f4'", function () {
            $f4 = f4();
            expect($f4[0]).toBe(document);
            expect($f4.length).toBe(1);
        });

        it("should work when the string is passed to the 'f4'", function () {
            $f4 = f4('body');
            expect($f4[0]).toBe(document.body);
            expect($f4.length).toBe(1);
        });

        it("should work when DOM object is passed to the 'f4'", function () {
            $f4 = f4(document.body);
            expect($f4[0]).toBe(document.body);
            expect($f4.length).toBe(1);

            $f4 = f4(document);
            expect($f4[0]).toBe(document);
            expect($f4.length).toBe(1);

            var el = document.createElement('div');
            $f4 = f4(el);
            expect($f4[0]).toBe(el);
            expect($f4.length).toBe(1);
        });

        it("should find elements inside each other", function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            el.appendChild(find);
            $f4 = f4(el).find('span');
            expect($f4[0]).toBe(find);
            expect($f4.length).toBe(1);

            var anotherFind = document.createElement('i');
            find.appendChild(anotherFind);
            $f4 = f4(el).find('i');
            expect($f4[0]).toBe(anotherFind);
            expect($f4.length).toBe(1);
        });

        it("should find elements inside each other", function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            el.appendChild(find);
            $f4 = f4(el).find('span');
            expect($f4[0]).toBe(find);
            expect($f4.length).toBe(1);

            var anotherFind = document.createElement('i');
            find.appendChild(anotherFind);
            $f4 = f4(el).find('i');
            expect($f4[0]).toBe(anotherFind);
            expect($f4.length).toBe(1);
        });

        it("should not find elements if they do not exist", function () {
            $f4 = f4('idonotexist');
            expect($f4[0]).toBeUndefined();
            expect($f4.length).toBe(0);
        });

        it("should work with multiple elements", function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            var anotherFind = document.createElement('span');
            el.appendChild(find);
            el.appendChild(anotherFind);
            $f4 = f4(el).find('span');
            expect($f4[0]).toBe(find);
            expect($f4[1]).toBe(anotherFind);
            expect($f4.length).toBe(2);


            var moreFind = document.createElement('i');
            var lastFind = document.createElement('i');
            find.appendChild(moreFind);
            anotherFind.appendChild(lastFind);
            $f4 = $f4.find('i');
            expect($f4[0]).toBe(moreFind);
            expect($f4[1]).toBe(lastFind);
            expect($f4.length).toBe(2);
        });

        it("should return all prototypes", function () {
            $f4 = f4('body');
            Object.keys(f4.proto).forEach(function (name) {
                expect($f4[name]).toBe(f4.proto[name]);
            });
        });

    });

    describe("'remove' method", function () {
        var el = document.createElement('div');
        var find = document.createElement('span');
        var anotherFind = document.createElement('span');
        el.appendChild(find);
        el.appendChild(anotherFind);
        var $f4 = f4(el);
        var $res = $f4.find('span').remove();

        it("should remove elements", function () {
            expect(el.children.length).toBe(0);
            $f4 = $f4.find('*');
            expect($f4[0]).toBeUndefined();
            expect($f4.length).toBe(0);
        });

        it("should return removed elements", function () {
            expect($res[0]).toBe(find);
            expect($res[1]).toBe(anotherFind);
            expect($res.length).toBe(2);
        });

        it("should return all prototypes", function () {
            Object.keys(f4.proto).forEach(function (name) {
                expect($res[name]).toBe(f4.proto[name]);
            });
        });

    });

    describe("'closest' method", function () {
        var el = document.createElement('div');
        var find = document.createElement('b');
        var anotherFind = document.createElement('span');
        var moreFind = document.createElement('i');
        var alsoFind = document.createElement('i');
        el.appendChild(find);
        find.appendChild(anotherFind);
        anotherFind.appendChild(moreFind);
        anotherFind.appendChild(alsoFind);
        var $f4;
        var $res;

        it("should return parents if no arguments are passed", function () {
            $f4 = f4(moreFind);
            $res = $f4.closest();
            expect($res[0]).toBe(anotherFind);
            expect($res.length).toBe(1);
        });


        it("should not return same elements", function () {
            $f4 = f4(el).find('i');
            $res = $f4.closest();
            expect($f4.length).toBe(2);
            expect($res[0]).toBe(anotherFind);
            expect($res.length).toBe(1);
        });

        it("should return parent for each element", function () {
            $f4 = f4(el).find('b, span');
            $res = $f4.closest();
            expect($f4.length).toBe(2);
            expect($res[0]).toBe(el);
            expect($res[1]).toBe(find);
            expect($res.length).toBe(2);
        });

        it("should return closest parent that matches passed query", function () {
            $f4 = f4(moreFind);
            $res = $f4.closest('div');
            expect($res[0]).toBe(el);
            expect($res.length).toBe(1);
        });

        it("should not return closest parent if cant find it", function () {
            $f4 = f4(alsoFind);
            $res = $f4.closest('body');
            expect($res[0]).toBeUndefined();
            expect($res.length).toBe(0);

            $f4 = f4(el);
            $res = $f4.closest();
            expect($res[0]).toBeUndefined();
            expect($res.length).toBe(0);
        });

        it("should return all prototypes", function () {
            $res = f4(moreFind).closest('div');
            Object.keys(f4.proto).forEach(function (name) {
                expect($res[name]).toBe(f4.proto[name]);
            });
        });

    });

    describe("'f4.create' method", function () {
        var $f4;

        it("should return correct elements", function () {
            $f4 = f4.create('<div></div>');
            expect($f4[0]).toBeObject();
            expect($f4.length).toBe(1);
            $f4 = $f4.find('*');
            expect($f4[0]).toBeUndefined();
            expect($f4.length).toBe(0);

            $f4 = f4.create('<div><span><i></i></span><b></b></div><span><i></i></span><a></a>');
            expect($f4[0]).toBeObject();
            expect($f4[1]).toBeObject();
            expect($f4[2]).toBeObject();
            expect($f4[3]).toBeUndefined();
            expect($f4.length).toBe(3);
            $f4 = $f4.find('i');
            expect($f4[0]).toBeObject();
            expect($f4[1]).toBeObject();
            expect($f4[2]).toBeUndefined();
            expect($f4.length).toBe(2);
        });

        it("should return all prototypes", function () {
            $f4 = f4.create('<div></div>');
            Object.keys(f4.proto).forEach(function (name) {
                expect($f4[name]).toBe(f4.proto[name]);
            });
        });

    });
})();