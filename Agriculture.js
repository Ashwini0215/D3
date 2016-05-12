var fs = require('fs');
var file = fs.readFileSync('production.csv').toString();
var line = file.split('\n');
var header = line[0].split(',');
var indexOf2013 = header.indexOf(' 3-2013')+1;
var indexOf1993 = header.indexOf(' 3-1993')+1;
// console.log(indexOf2013);
var oilseeds = [];
for (var i = 1; i < line.length; i++) {
  if(line[i].split(',')[0].split(' ')[2]=='Oilseeds'){
      var product = line[i].split(',')[0].split('Oilseeds')[1];
      var units = line[i].split(',')[indexOf2013];
      if(product){
        oilseeds.push({
          product:product,
          units:units
        });
      }

  }
}
oilseeds.sort(function(a,b){
  return b.units - a.units;
});
 //console.log(oilseeds);
fs.writeFile('oilseeds.json',JSON.stringify(oilseeds,null,4));

var Foodgrains = [];
for (var i = 1; i < 33; i++) {
  if(line[i].split(',')[0].split(' ')[2]=='Foodgrains'){
      var product = line[i].split(',')[0].split('Foodgrains')[1];
      var units= line[i].split(',')[indexOf2013];
      if(product){
        Foodgrains.push({
          product:product,
          units:units
        });
      }

  }
}
Foodgrains.sort(function(a,b){
  return b.units- a.units;
});
fs.writeFile('Foodgrains.json',JSON.stringify(Foodgrains,null,4));


var commercial = [];
for (var i = 1; i < line.length; i++) {
  if(line[i].split(',')[0].split(' ')[2]=='Commercial'){
      var product = line[i].split(',')[0].split('Commercial Crops')[1];
      var units = [];
      if(product){
        var year = 1992;
        for (var j = indexOf1993; j <= indexOf2013; j++) {
          year++;
          var v = {};
          v.year = year;
          v.units = line[i].split(',')[j]
          if(v.units=='NA'){
            v.units = 0;
          }
          units.push(v);
        }
        if(product!=' Crops Jute and Mesta'){
          commercial.push({
            product:product,
            units:units
          });
        }
      }

  }
}
var total = {};
total.name = 'aggregate crops';
total.units = [];
var year = 1993;
for (var i = 0; i < commercial[0].units.length; i++) {
  var sum = 0;
  for (var j = 0; j < commercial.length; j++) {
    if(commercial[j])
    sum+= parseFloat(commercial[j].units[i].units);
  }
  total.units.push({
    year : year + i,
    sum:sum
  })
}

fs.writeFile('commercial.json',JSON.stringify(total,null,4));

var yearData=[];
for (var i = indexOf1993; i <= indexOf2013; i++) {
  var year = 1993;
  for (var j = 0; j < line.length; j++) {
    var state = line[j].split(',')[0].split('Rice Volume')[1];
    if(state == ' Andhra Pradesh'){
      //|| state ==' Karnataka' || state ==' Tamil Nadu' || state ==' Kerala')
      key = year+i-indexOf1993;
      valueAP = line[j].split(',')[i];
      if (valueAP=="NA") {
        valueAP = 0;
      }
    }
    if(state == ' Karnataka'){
      key = year+i-indexOf1993;
      valueKA = line[j].split(',')[i];
      if (valueKA=="NA") {
        valueKA = 0;
      }
    }
    if(state ==' Tamil Nadu' ){
      key = year+i-indexOf1993;
      valueTN = line[j].split(',')[i];
      if (valueTN=="NA") {
        valueTN = 0;
      }
    }

    if(state ==' Kerala' ){
      key = year+i-indexOf1993;
      valueKE = line[j].split(',')[i];
      if (valueKE=="NA") {
        valueKE = 0;
      }
    }


  }

  yearData.push({key,AndhraPradesh:valueAP,Karnataka:valueKA,TamilNadu:valueTN,Kerala:valueKE });
}
fs.writeFile('key.json',JSON.stringify(yearData,null,4));
