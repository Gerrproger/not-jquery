(function () {
    describe('\'find\' method', function () {
        var $nj;

        it('should work when nothing is passed to the \'nj\'', function () {
            $nj = nj();
            expect($nj[0]).toBe(document);
            expect($nj.length).toBe(1);
        });

        it('should work when the string is passed to the \'nj\'', function () {
            $nj = nj('body');
            expect($nj[0]).toBe(document.body);
            expect($nj.length).toBe(1);
        });

        it('should work when DOM object is passed to the \'nj\'', function () {
            $nj = nj(document.body);
            expect($nj[0]).toBe(document.body);
            expect($nj.length).toBe(1);

            $nj = nj(document);
            expect($nj[0]).toBe(document);
            expect($nj.length).toBe(1);

            var el = document.createElement('div');
            $nj = nj(el);
            expect($nj[0]).toBe(el);
            expect($nj.length).toBe(1);
        });

        it('should find elements inside each other', function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            el.appendChild(find);
            $nj = nj(el).find('span');
            expect($nj[0]).toBe(find);
            expect($nj.length).toBe(1);

            var anotherFind = document.createElement('i');
            find.appendChild(anotherFind);
            $nj = nj(el).find('i');
            expect($nj[0]).toBe(anotherFind);
            expect($nj.length).toBe(1);
        });

        it('should find elements inside each other', function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            el.appendChild(find);
            $nj = nj(el).find('span');
            expect($nj[0]).toBe(find);
            expect($nj.length).toBe(1);

            var anotherFind = document.createElement('i');
            find.appendChild(anotherFind);
            $nj = nj(el).find('i');
            expect($nj[0]).toBe(anotherFind);
            expect($nj.length).toBe(1);
        });

        it('should not find elements if they do not exist', function () {
            $nj = nj('idonotexist');
            expect($nj[0]).toBeUndefined();
            expect($nj.length).toBe(0);
        });

        it('should work with multiple elements', function () {
            var el = document.createElement('div');
            var find = document.createElement('span');
            var anotherFind = document.createElement('span');
            el.appendChild(find);
            el.appendChild(anotherFind);
            $nj = nj(el).find('span');
            expect($nj[0]).toBe(find);
            expect($nj[1]).toBe(anotherFind);
            expect($nj.length).toBe(2);


            var moreFind = document.createElement('i');
            var lastFind = document.createElement('i');
            find.appendChild(moreFind);
            anotherFind.appendChild(lastFind);
            $nj = $nj.find('i');
            expect($nj[0]).toBe(moreFind);
            expect($nj[1]).toBe(lastFind);
            expect($nj.length).toBe(2);
        });

        it('should return all prototypes', function () {
            $nj = nj('body');
            Object.keys(nj.proto).forEach(function (name) {
                expect($nj[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'remove\' method', function () {
        var el = document.createElement('div');
        var find = document.createElement('span');
        var anotherFind = document.createElement('span');
        el.appendChild(find);
        el.appendChild(anotherFind);
        var $nj = nj(el);
        var $res = $nj.find('span').remove();

        it('should remove elements', function () {
            expect(el.children.length).toBe(0);
            $nj = $nj.find('*');
            expect($nj[0]).toBeUndefined();
            expect($nj.length).toBe(0);
        });

        it('should return removed elements', function () {
            expect($res[0]).toBe(find);
            expect($res[1]).toBe(anotherFind);
            expect($res.length).toBe(2);
        });

        it('should return all prototypes', function () {
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'closest\' method', function () {
        var el = document.createElement('div');
        var find = document.createElement('b');
        var anotherFind = document.createElement('span');
        var moreFind = document.createElement('i');
        var alsoFind = document.createElement('i');
        el.appendChild(find);
        find.appendChild(anotherFind);
        anotherFind.appendChild(moreFind);
        anotherFind.appendChild(alsoFind);
        var $nj;
        var $res;

        it('should return parents if no arguments are passed', function () {
            $nj = nj(moreFind);
            $res = $nj.closest();
            expect($res[0]).toBe(anotherFind);
            expect($res.length).toBe(1);
        });


        it('should not return same elements', function () {
            $nj = nj(el).find('i');
            $res = $nj.closest();
            expect($nj.length).toBe(2);
            expect($res[0]).toBe(anotherFind);
            expect($res.length).toBe(1);
        });

        it('should return parent for each element', function () {
            $nj = nj(el).find('b, span');
            $res = $nj.closest();
            expect($nj.length).toBe(2);
            expect($res[0]).toBe(el);
            expect($res[1]).toBe(find);
            expect($res.length).toBe(2);
        });

        it('should return closest parent that matches passed query', function () {
            $nj = nj(moreFind);
            $res = $nj.closest('div');
            expect($res[0]).toBe(el);
            expect($res.length).toBe(1);
        });

        it('should not return closest parent if cant find it', function () {
            $nj = nj(alsoFind);
            $res = $nj.closest('body');
            expect($res[0]).toBeUndefined();
            expect($res.length).toBe(0);

            $nj = nj(el);
            $res = $nj.closest();
            expect($res[0]).toBeUndefined();
            expect($res.length).toBe(0);
        });

        it('should return all prototypes', function () {
            $res = nj(moreFind).closest('div');
            Object.keys(nj.proto).forEach(function (name) {
                expect($res[name]).toBe(nj.proto[name]);
            });
        });

    });

    describe('\'nj.create\' method', function () {
        var $nj;

        it('should return correct elements', function () {
            $nj = nj.create('<div></div>');
            expect($nj[0]).toBeObject();
            expect($nj.length).toBe(1);
            $nj = $nj.find('*');
            expect($nj[0]).toBeUndefined();
            expect($nj.length).toBe(0);

            $nj = nj.create('<div><span><i></i></span><b></b></div><span><i></i></span><a></a>');
            expect($nj[0]).toBeObject();
            expect($nj[1]).toBeObject();
            expect($nj[2]).toBeObject();
            expect($nj[3]).toBeUndefined();
            expect($nj.length).toBe(3);
            $nj = $nj.find('i');
            expect($nj[0]).toBeObject();
            expect($nj[1]).toBeObject();
            expect($nj[2]).toBeUndefined();
            expect($nj.length).toBe(2);
        });

        it('should return all prototypes', function () {
            $nj = nj.create('<div></div>');
            Object.keys(nj.proto).forEach(function (name) {
                expect($nj[name]).toBe(nj.proto[name]);
            });
        });

    });
})();