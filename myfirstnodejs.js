var http = require('http');
var url = require('url')
var port = process.env.PORT || 8080;

// http://localhost:8080/get-sum?a=11&b=120
function listener(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});

  var urlParts = url.parse(req.url);

  if (urlParts.pathname == '/get-sum'){

    var q = url.parse(req.url, true).query;
    res.write(q.a + " + " + q.b + " = " + sum(q.a, q.b));
  }
  else{
    res.write("browse /get-sum");
  }

  res.end();
}

http.createServer(listener).listen(port);

function sum(a, b){
  return parseInt(a) + parseInt(b);
}