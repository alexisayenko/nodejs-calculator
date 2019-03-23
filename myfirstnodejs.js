var http = require('http');
var url = require('url')
var port = process.env.PORT || 8080;

http.createServer(listener).listen(port);

function listener(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});

  var urlParts = url.parse(req.url);
  var q = url.parse(req.url, true).query;

  switch (urlParts.pathname){
  case '/get-sum':
    get_sum_handler(q, res);
    break;
  case '/get-mul':
    get_mul_handler(q, res);
    break;
  case '/tictactoe':
    tictactoe_handler(q, res);
    break;
  default:
    res.write("browse /get-sum");
    break;
  }

  res.end();
}

// tictactoe?field=__X_Y_

// not set _

/*
1 2 3
4 5 6
7 8 9
*/

function getNextStep(field, playerSymbol, emptySpaceSymbol){

  if (field.length != 9 || playerSymbol.length != 1 || emptySpaceSymbol.length != 1){
    return "wrong format";
  }

  var combinations = ["123", "456", "789", "147", "258", "369", "159", "357"];

  for(index1 = 1; index1 < 9; index1++)
    for(index2 = 1; index2 < 9; index2++){

      if (index1 == index2)
        continue;

      var symb1 = field[index1 - 1];
      var symb2 = field[index2 - 1];

      if (symb1 != symb2)
        continue;

      if (symb1 != playerSymbol)
        continue;

      for(c = 0; c < 8; c++){
        if (combinations[c].indexOf(index1) > -1 && combinations[c].indexOf(index2) > -1){
          var combination = combinations[c];
          var nextMove = combination.replace(index1+"", "").replace(index2+"", "");

          if (field[parseInt(nextMove) - 1] == emptySpaceSymbol)
            return nextMove; 
        }}
  }

  return "nothing found";
}



/*
best next move

123
456
789
147
258
369
159
357


12 -> 3
13 -> 2
14 -> 7
15 -> 9
17 -> 4
19 -> 5
23 -> 1
25 -> 8
28 -> 5
35 -> 7
36 -> 9
45 -> 6
47 -> 1
56 -> 4
58 -> 2
59 -> 1
...

*/

function unittest(res){

  var combinations = ["123", "456", "789", "147", "258", "369", "159", "357"];

  for (c=0; c< 8; c++){
    var field = "_________";
    var index1 = parseInt(combinations[c][0]-1);
    var index2 = parseInt(combinations[c][1]-1);
    res.write(index1+"");
    field = [field.slice(0, index1), "A", field.slice(index1+1)].join('');
    field = [field.slice(0, index2), "A", field.slice(index2+1)].join('');

    res.write("field:" + field);
    res.write("<br/>");
    res.write("["+getNextStep(field, "A", "_", res)+"]");
    res.write("<br/>");
  }
}

function tictactoe_handler(q, res){
  
  // unittest(res);
  // /tictactoe?field=__A__A___&player=A&empty=_
  //res.write(getNextStep("__A__A___", "A", "_"));
  res.write(getNextStep(q.field, q.player, q.empty));
}

function get_mul_handler(q, res){
  res.write(q.a + " x " + q.b + " = " + mul(q.a, q.b));
}

function get_sum_handler(q, res){
    res.write(q.a + " + " + q.b + " = " + sum(q.a, q.b));
}

function sum(a, b){
  return parseInt(a) + parseInt(b);
}

function mul(a, b){
  return parseInt(a) * parseInt(b);
}