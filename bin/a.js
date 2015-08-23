'use strict';

/**
 *  dev helper convert color-mapping.js to json file
 */

require('fs').writeFile(
  __dirname + '/../conf/color-mapping.json',
  JSON.stringify(require('../conf/color-mapping')),
  function(err) { if (err) throw err; else console.log('Done!'); }
);
