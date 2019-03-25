var XLSX = require('xlsx');
var workbook = XLSX.readFile('C:/Users/Oleg_Tymchak/Desktop/01_09_18_27_12_18 - Copy.xlsx');

var sheet_name_list = workbook.SheetNames;

sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(var z in worksheet) {
        if(z[0] === '!') continue;
        //console.log(z);
        //parse out the column, row, and value
        var col = z.substring(0,1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].w;

        //store header names
        if(row == 1) {
            headers[col] = value;
            continue;
        }

        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
        
        //console.log(col);
        //console.log(row);
        //console.log(value);
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    console.log(data);
});