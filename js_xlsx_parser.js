var XLSX = require('xlsx');
var workbook = XLSX.readFile('C:/01_09_18_27_12_18 - Copy.xlsx');

var data = [];
workbook.SheetNames.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    
    for(var z in worksheet) {
        if(z[0] === '!') continue;
        
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
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    //console.log(data);
});

var result = {};

data.forEach(function(entry) {
    
    if (!result[entry.Name]) result[entry.Name] = {};
    var employee = result[entry.Name];

    var date = new Date(entry.time);
    var dateString = date.toLocaleDateString();
    
    if (!employee[dateString]) employee[dateString] = {};
    var dateEntry = employee[dateString];

    if (!dateEntry.totalTime) dateEntry.totalTime = 0;
    
    if (!dateEntry.date) {
        dateEntry.date = date;
    } else {
        dateEntry.totalTime += date - dateEntry.date; 
    }
    

})

console.log(result)
