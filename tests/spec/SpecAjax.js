(function () {
    describe("Not-jquery Ajax", function () {

        var onSuccess, onFailure;
        beforeEach(function () {
            jasmine.Ajax.install();
            onSuccess = jasmine.createSpy('onSuccess');
            onFailure = jasmine.createSpy('onFailure');
        });
        afterEach(function () {
            jasmine.Ajax.uninstall();
        });

        it("should perform the request and call the specified function with 'xhr' and 'response' arguments", function () {
            var text = 'immediate response';
            jasmine.Ajax.stubRequest('/test/url').andReturn({
                status: 200,
                responseText: text
            });

            nj.ajax({
                url: '/test/url'
            }, onSuccess, onFailure);

            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[0]).toEqual(jasmine.Ajax.requests.mostRecent());
            expect(onSuccess.calls.mostRecent().args[1]).toBe(text);
        });

        it("should perform the request with correct 'url', 'method', 'user', 'password', 'body' and 'timeout'", function () {
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

            nj.ajax(settings, onSuccess, onFailure);

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

        it("should call 'beforeSend' function if specified", function () {
            var onBeforeSend = jasmine.createSpy('onBeforeSend');
            var url = '/test/this/path';
            var response = 'response text';

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                responseText: response
            });

            nj.ajax({
                url: url,
                beforeSend: onBeforeSend
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('GET');
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[1]).toBe(response);
            expect(onBeforeSend).toHaveBeenCalled();
            expect(onBeforeSend.calls.mostRecent().args[0]).toEqual(jasmine.Ajax.requests.mostRecent());
        });

        it("should send form data with the right header if specified 'form' attribute", function () {
            var url = '/test/this/path';
            var response = 'response text';
            var formObj = [{key: 'field1', val: 'value1'}, {key: 'field2', val: 'value2'}];
            var el = document.createElement('form');
            el.innerHTML = '<input name="field1" value="value1"/><input name="field2" value="value2"/>';

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                responseText: response
            });

            nj.ajax({
                url: url,
                form: el
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            var formData = request.params;
            expect(request.url).toBe(url);
            expect(request.method).toBe('POST');
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(request.requestHeaders['Content-Type']).toBe('multipart/form-data; charset=UTF-8');
            expect(formData).toEqual(jasmine.any(FormData));
            if (formData.get) {
                formObj.forEach(function (obj) {
                    expect(formData.get(obj.key)).toBe(obj.val);
                });
            }
        });

        it("should override MimeType if specified", function () {
            var url = '/test/this/path';
            var response = 'response text';
            var mime = 'test/plain';

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                responseText: response
            });

            nj.ajax({
                url: url,
                method: 'put',
                overrideMimeType: mime
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('PUT');
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(request.overriddenMimeType).toBe(mime);
        });

        it("should set request headers if specified", function () {
            var url = '/test/this/path';
            var response = 'response text';
            var headers = {
                'Test-Header': 'test',
                'Authorization': 'Basic'
            };

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 403,
                responseText: response
            });

            nj.ajax({
                url: url,
                headers: headers
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('GET');
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onFailure).toHaveBeenCalled();
            expect(request.requestHeaders).toEqual(headers);
        });

        it("should parse and set the specified parameters for the GET or HEAD method request", function () {
            var url = '/test/this/path';
            var response = 'response text';
            var urlWithParams = '/test/this/path?param1=val1&param2=val2';

            jasmine.Ajax.stubRequest(urlWithParams).andReturn({
                status: 200,
                responseText: response
            });

            nj.ajax({
                url: url,
                params: {
                    param1: 'val1',
                    param2: 'val2'
                }
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(urlWithParams);
            expect(request.method).toBe('GET');
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();

            url = '/test/this/path?firstParam=1';
            urlWithParams = '/test/this/path?firstParam=1&param1=val1&param2=val2';

            nj.ajax({
                url: url,
                method: 'head',
                params: {
                    param1: 'val1',
                    param2: 'val2'
                }
            }, onSuccess, onFailure);

            request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(urlWithParams);
            expect(request.method).toBe('HEAD');
        });

        it("should parse and set specified parameters and add 'JSON' header for POST or PUT method request", function () {
            var url = '/test/this/path';
            var response = 'response text';
            var header = 'application/json; charset=UTF-8';
            var params = {
                param1: 'val1',
                param2: 'val2',
                param3: 'val3'
            };

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                responseText: response
            });

            nj.ajax({
                url: url,
                method: 'post',
                params: params
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('POST');
            expect(onSuccess).toHaveBeenCalled();
            expect(onFailure).not.toHaveBeenCalled();
            expect(request.data()).toEqual(params);
            expect(request.requestHeaders['Content-Type']).toEqual(header);

            params = {
                test1: 'val1',
                test2: [1, 2, 3]
            };

            nj.ajax({
                url: url,
                method: 'put',
                params: params
            }, onSuccess, onFailure);

            request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('PUT');
            expect(request.data()).toEqual(params);
            expect(request.requestHeaders['Content-Type']).toEqual(header);
        });

        it("should parse response data of 'html' type", function () {
            var url = '/test/this/path';

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                contentType: 'text/html;charset=UTF-8',
                responseText: '<div id="i-am-test-div"><b></b><i></i></div>'
            });

            nj.ajax({
                url: url
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('GET');
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[0]).toEqual(request);
            expect(onSuccess.calls.mostRecent().args[1]).toEqual(jasmine.any(Object));
            expect(onSuccess.calls.mostRecent().args[1][0]).toEqual(jasmine.any(HTMLElement));
            expect(onSuccess.calls.mostRecent().args[1][0].id).toBe('i-am-test-div');
        });

        it("should parse response data of 'json' type", function () {
            var url = '/test/this/path';
            var json = {a: 1, b: [1, 2, 3], c: 'd'};

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                contentType: 'application/json;charset=UTF-8',
                responseText: JSON.stringify(json)
            });

            nj.ajax({
                url: url,
                dataType: 'auto'
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('GET');
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[0]).toEqual(request);
            expect(onSuccess.calls.mostRecent().args[1]).toEqual(json);
        });

        it("should parse response according to the specified data type", function () {
            var url = '/test/this/path';
            var json = {a: 1, b: [1, 2, 3], c: 'd'};

            jasmine.Ajax.stubRequest(url).andReturn({
                status: 200,
                contentType: 'text/plain;charset=UTF-8',
                responseText: JSON.stringify(json)
            });

            nj.ajax({
                url: url,
                dataType: 'json'
            }, onSuccess, onFailure);

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe(url);
            expect(request.method).toBe('GET');
            expect(onFailure).not.toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalled();
            expect(onSuccess.calls.mostRecent().args[0]).toEqual(request);
            expect(onSuccess.calls.mostRecent().args[1]).toEqual(json);
        });

    });
})();