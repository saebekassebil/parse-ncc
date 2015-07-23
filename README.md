# parse-ncc

    $ npm install parse-ncc

## usage

Can be used with any DOM - browser or JavaScript implementation (like jsdom)

```js
var parse = require('parse-ncc');
var jsdom = require('jsdom');

// Fetch a DOM representing the NCC file, from anywhere you like
jsdom.env('http://example.com/path/to/file.ncc', function(err, window) {
  var nccFile = window.document.body;

  function printStructure(structure, level) {
    level = level || 0;

    struc.forEach(function(heading) {
      var headerElement = heading.heading;

      console.log(
        Array(level*2).join(' '),
        headerElement.tagName.toUpperCase(),
        headerElement.textContent
      );

      if (heading.children) {
        printStructure(heading.children, level + 1);
      }
    });
  }

  var structure = parse(nccFile);
  printStructure(structure);
});
```

## api

### var parse = require('parse-ncc');

### parse(Element) -> structure

`parse` is a function, taking an `Element`. It will return a
hierarchical representation of the flat NCC file. E.g.
```html
<h1>Introduction</h1>
<h2>Foreword</h2>
<h2>Notice</h2>
<h3>Copyright</h3>
<h1>Chapter One</h1>
```
will turn into
```js
[
  {
    heading: H1(Introduction),
    children: [
      {
        heading: H2(Foreword),
        children: []
      },
      {
        heading: H2(Notice),
        children: [
          {
            heading: H3(Copyright),
            children: []
          }
        ]
      }
    ]
  },
  {
    heading: H1(Chapter One),
    children: []
  }
]
```

Each element in the `structure` has the following properties:
```js
{
  heading: HTMLElement, // The DOM element of the NCC document
  children: Array()     // An array of other heading elements
}
```
