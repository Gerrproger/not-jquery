# not-jquery

**A very lightweight library that implements the core features of jQuery.**\
In fact, it is just a syntactic sugar over the standard browser methods.\
The library is suitable for old environments and very simple pages with basic interactions.

### Supported browsers:

- IE10+
- All other "modern" browsers

## Usage

You can download it from **[Releases](https://github.com/Gerrproger/not-jquery/releases)** or include directly from **jsDelivr**:

```html
<head>
  <script type="text/javascript" src="dist/not-jquery.min.js"></script>
  <!-- OR -->
  <script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/gh/gerrproger/not-jquery@latest/dist/not-jquery.min.js"
  ></script>
</head>
```

API is inspired by jQuery - it returns a _special array_ of elements (`nj obj`) and supports chaining:

```js
var content = nj('.article').removeClass('highlight').find('.content');
```

If you do not want AJAX (and you probably don't), include `dist/not-jquery-noajax.min.js`.

Also, `dist/not-browser.min.js` can be used to detect unsupported browsers (ancient ones). Just include it before the main lib and then _not-jquery_ will automatically skip initialization (your code will not be thrown with an error):

```html
<head>
  <script type="text/javascript" src="dist/not-browser.min.js"></script>
  <script type="text/javascript" src="dist/not-jquery.min.js"></script>
</head>
```

## API

_Not-jquery_ exports itself in `window` as `nj`.\
For convenience, you can do this:

```js
var $ = nj`;
```

You can extend `nj` with your own methods like so:

```js
nj.proto.myMethod = myMethod;
```

Most methods return `nj object` which looks like Array and support some Array built in methods:

```js
nj('.els').forEach(function (el) {
  var njObj = nj(el);
});
```

### Methods

#### .find(query)

- `query` - **required** one of the types:
  - _String_ | CSS selector
  - _HTMLElement_
  - _Array[HTMLElement]_
  - _Array[nj obj]_

Returns `nj obj` with found DOM elements.\
Calling `nj('.els')` = `nj().find('.els')`.

#### .closest(selector)

- `selector` - _String_ **not required** | CSS selector

Finds the closest parent(s) matching the `selector`, or just a parent if `selector` is not specified.\
Returns `nj obj` with DOM elements.

#### .remove()

Removes previously matched elements from DOM.

#### .html(string)

- `string` - _String_ **not required** | HTML markdown

If `string` is passed, sets it as HTML content of matched elements.\
Otherwise, returns inner HTML as a _String_.

#### .text(text)

- `text` - _String_ **not required**

If `text` is passed, sets it as content of matched elements.\
Otherwise, returns inner Text as a _String_.

#### .attr(name [, value])

- `name` - _String_ **not required** | element attribute name
- `value` - _String_ or _Object_ **not required** | attribute value

If `value` is passed, sets it as value for the attribute with the specified name.\
Otherwise, returns an attribute value with the specified name as a _String_ or _Object_ (if the value can be parsed).\
If `name` is not passed, returns all attribute as object: `{attrName1: attrValue1, attrName2: attrValue2}`.

#### .removeAttr(name)

- `name` - _String_ **required** | element attribute name

Removes an attribute with the specified name.

#### .data(data)

- `data` - _String_ or _Object_ **not required** | data attribute name or `{name: value}`

If `data` is a _String_ (ex: `'test'`), returns value as a _String_ or _Object_ (if value can be parsed) for corresponding data attribute (`'data-test'`).\
If `data` is an _Object_ (`{dataName1: dataVal1, dataName2: dataVal2}`), sets corresponding data attributes. CamelCase names will become dashed.\
If `data` is not passed, returns all data attributes as an object `{dataName1: dataVal1, dataName2: dataVal2}`.

#### .removeData(name)

- `name` - _String_ **required** | element data attribute name

Removes attribute with the specified name, camelCase names will become dashed.\
Example: `nj('.els').removeData('exampleName')` will remove `data-example-name` attribute.

#### .addClass(class1 [, class2]...)

- `classN` - _String_ **required** | class name or class names, separated with spaces (`'class1 class2'`).

Adds classes to the elements.

#### .removeClass(class1 [, class2]...)

- `classN` - _String_ **required** | class name or class names, separated with spaces (`'class1 class2'`).

Removes classes from the elements.

#### .toggleClass(class1 [, class2]...)

- `classN` - _String_ **required** | class name or class names, separated with spaces (`'class1 class2'`).

Toggles classes for the elements.

#### .hasClass(class)

- `class` - _String_ **required** | class name

Returns _Boolean_ `true` if all matched elements have a class with the specified name.

#### .on(event, callback [, namespace])

- `event` - _String_ **required** | event name
- `callback` - _Function_ **required** | callback function
- `namespace` - _String_ **not required** | used to remove listeners

Adds an event listener for the specified `event` which will call the provided `callback` with the original `event object`.\
Namespace can be used later to remove multiple listeners (may not be unique).

#### .off(event [, namespace])

- `event` - _String_ **not required** | event name
- `namespace` - _String_ **not required** | if you provided it for `on` method

If `event` is passed, removes all listeners for this event, or only ones that were added with the same `namespace`.\
If nothing is passed, will remove all event listeners from the elements.

#### .transitionEnd(callback, target, prop [, pseudo])

- `callback` - _Function_ **required** | callback function
- `target` - _HTMLElement_ or _String='all'_ or _Nullish_ **required** | target element
- `prop` - _String_ **not required** | transitioned property name
- `pseudo` - _String='before'||'after'_ | listen event on pseudo-element

Adds an event listener for the transition end event with a more convenient API.\
Calls `callback` after transition ended for the original matched element if `target` is _Nullish_; or if the event target matches passed _HTMLElement_ (that could be the original element's child); or if the target is any element when passed the _String_ `'all'`.\
If `prop` is passed, calls `callback` only for the specified property name transition end; otherwise calls for any properties.\
If `pseudo` is passed, calls `callback` only if transitioned target is a pseudo-element (`::bfore` or `::after`).

#### nj.create(string)

- `string` - _String_ **required** | HTML markdown

Creates and returns _HTMLElements_.

### Properties

#### .proto

- **Type:** _Object_

Contains all `nj` methods.\
You can add your own methods to it before calling `nj()`.

#### .version

- **Type:** _String_

The library version.

#### .supported

- **Type:** _Boolean_ or _Undefined_

Return `true`, if browser supports `nj`.\
Only present if `not-browser` was included in the page before `not-jquery`.

### AJAX method nj.ajax(settings, success, fail)

This method is not present in `not-jquery-noajax.js`.

#### settings{} object

- `settings.url` - _String_ **required** | requested URL
- `settings.method` - _String_ **not required** | method, default: `'GET'` or `'POST'` for forms
- `settings.user` - _String_ **not required** | username for authentication
- `settings.password` - _String_ **not required** | password for authentication
- `settings.body` - _String_ **not required** | request body
- `settings.form` - _Object_ **not required** | form object to send in body (`{name: value}`)
- `settings.timeout` - _Number_ **not required** | request timeout (ms), default: 10000
- `settings.params` - _Object_ **not required** | will be included as query for GET or HEAD, and in body otherwise
- `settings.headers` - _Object_ **not required** | headers to set for request (`{headerName: headerValue}`)
- `settings.dataType` - _String='html'||'json'||'text'||'auto'_ **not required** | response data type, body will be automatically parsed according to the specified `dataType`, default: `'auto'` (if `html`, elements will be created from the markup)
- `settings.beforeSend` - _Function_ **not required** | calls this function before sending request with `xhr object` as a parameter
- `settings.readyStateChange` - _Function_ **not required** | calls this function when ready state changes for the request (with `xhr object` as a parameter)
- `settings.overrideMimeType` - _String_ **not required** | override request mime type

#### success(response, xhr) callback

- `response` - _String_ or _HTMLElement_ or _Object_ | parsed response, type can be changed via `settings.dataType` parameter
- `xhr` - _Object_ | original `xhr object`

Called when the request succeeded (_200_ response codes).

#### fail(response, xhr) callback

- `response` - _String_ or _HTMLElement_ or _Object_ | parsed response, type can be changed via `settings.dataType` parameter
- `xhr` - _Object_ | original `xhr object`

Called when the request failed.

### NotBrowser Properties

You should include `not-browser.js` to use it.

#### notBrowser.good

- **Type:** _Boolean_

Returns `true`, if browser supports `nj`.

#### notBrowser.version

- **Type:** _String_

The library version.
