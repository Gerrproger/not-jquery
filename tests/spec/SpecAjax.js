(function () {
    describe("F4ck-jquery Ajax", function () {

        var onSuccess, onFailure;
        beforeEach(function () {
            jasmine.Ajax.install();
            onSuccess = jasmine.createSpy('onSuccess');
            onFailure = jasmine.createSpy('onFailure');
        });
        afterEach(function () {
            jasmine.Ajax.uninstall();
        });

        it("should perform request and call the specified function with 'xhr' and 'response' arguments", function () {
            var text = 'immediate response';
            jasmine.Ajax.stubRequest('/test/url').andReturn({
                status: 200,
                responseText: text
            });

            f4.ajax({
                url: '/test/url'
            }, onSuccess, onFailure);

            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[0]).toEqual(jasmine.Ajax.requests.mostRecent());
            expect(onSuccess.calls.mostRecent().args[1]).toBe(text);
        });

        it("should perform request with correct 'url', 'method', 'user', 'password', 'body' and 'timeout'", function () {
            var response = 'response text';
            var url = '/test/correctness';
            var settings = {
                url: url,
                method: 'post',
                user: 'test',
                password: 'pswd',
                body: 'this is body',
                timeout: 100
            };
            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                responseText: response
            });

            f4.ajax(settings, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('POST');
            expect(request.username).toBe(settings.user);
            expect(request.password).toBe(settings.password);
            expect(request.params).toBe(settings.body);
            expect(request.timeout).toBe(settings.timeout);
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[1]).toBe(response);
        });

    });
})();