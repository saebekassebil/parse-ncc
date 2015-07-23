var fs = require('fs');
var test = require('tape');
var jsdom = require('jsdom');
var parse = require('../');

function simplifyStructure(structure) {
  return structure.map(function(heading) {
    return {
      text: heading.heading.textContent,
      children: simplifyStructure(heading.children)
    };
  });
}

function getNCC(filename, cb) {
  var file = fs.readFileSync(filename, { encoding: 'utf8' });
  jsdom.env(file, function(err, window) {
    var body = window.document.body;
    cb(body);
  });
}

test('It parses a deeply nested .ncc file', function(t) {
  t.plan(1);
  getNCC('test/mocks/nested.ncc', function(body) {
    var parsed = parse(body);
    var simplified = simplifyStructure(parsed);

    t.deepEqual(simplified, [
      {
        "text": "1",
        "children": [
          {
            "text": "1.1",
            "children": [
              {
                "text": "1.1.1",
                "children": [
                  {
                    "text": "1.1.1.1",
                    "children": []
                  }
                ]
              },
              {
                "text": "1.1.2",
                "children": []
              },
              {
                "text": "1.1.3",
                "children": []
              }
            ]
          },
          {
            "text": "1.2",
            "children": []
          }
        ]
      },
      {
        "text": "2",
        "children": []
      },
      {
        "text": "3",
        "children": [
          {
            "text": "3.1",
            "children": [
              {
                "text": "3.1.1",
                "children": [
                  {
                    "text": "3.1.1.1",
                    "children": [
                      {
                        "text": "3.1.1.1.1",
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  });
});

test('It parses a proper structured .ncc file', function(t) {
  t.plan(1);
  getNCC('test/mocks/proper.ncc', function(body) {
    var parsed = parse(body);
    var simplified = simplifyStructure(parsed);

    t.deepEqual(simplified, [
      {
        "text": "J. K. Rowling: Harry Potter og Fønixordenen",
        "children": [
          {
            "text": "Bogens bagside",
            "children": []
          },
          {
            "text": "Bibliografiske oplysninger",
            "children": []
          },
          {
            "text": "Oplysninger om denne udgave af bogen",
            "children": []
          }
        ]
      },
      {
        "text": "1. kapitel - Dudleys første kys",
        "children": []
      },
      {
        "text": "2. kapitel - En flom af ugler",
        "children": []
      },
      {
        "text": "3. kapitel - Fortroppen",
        "children": []
      },
      {
        "text": "4. kapitel - Grumsted Plads nummer tolv",
        "children": []
      },
      {
        "text": "5. kapitel - Fønixordenen",
        "children": []
      }
    ]);
  });
});
