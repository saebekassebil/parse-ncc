'use strict';

function getConsecutive(headings, level, collector) {
  var index = 0;

  while (headings.length > index) {
    var heading = headings[index];

    if (heading.tagName.toLowerCase() !== ('h' + level)) {
      // Return the current index if the heading isn't the given level
      return index;
    }

    // Create a section object
    var section = {
      heading: heading,
      children: []
    };

    // Collect all higher-level headings into that section's `children` array,
    // and increment the `index` accordingly
    index += getConsecutive(
      headings.slice(index + 1),
      level + 1,
      section.children
    );
    // Add the section to the collector array
    collector.push(section);
    index++;
  }

  // If the loop ran to the end of the `headings` array, return the array's length
  return headings.length;
}

module.exports = function parseNCC(dom) {
  if (!dom || typeof dom.querySelectorAll !== 'function')
    throw new Error('Cannot parse invalid DOM object');

  var headings = [].slice.call(dom.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (!headings.length) return [];

  // Find the level of the first heading (should be level 1)
  var level = parseInt(headings[0].tagName.slice(1), 10);
  
  var structure = [];
  getConsecutive(headings, level, structure);

  return structure;
};
