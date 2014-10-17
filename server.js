var express = require('express')
  , app = express()
  , port = process.argv.slice(2)[0] || 19101;

app.use('/', express.static('public'));

console.log('Web worker example reporting in on port ' + port);
app.listen(port);