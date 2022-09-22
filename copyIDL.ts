const fs = require('fs');
const idl = require('./target/idl/anchor_counter.json');

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl));