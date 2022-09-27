const fs = require('fs');
const idl = require('./target/idl/anchor_counter.json');

fs.writeFileSync('./app/public/idl.json', JSON.stringify(idl));
