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
        data[row]['row'] = row;
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
    var dateString = date.toISOString().split('T')[0];
    
    if (!employee[dateString]) employee[dateString] = [];
    var dateEntries = employee[dateString];
    
    if (entry.Text === 'Vstup do zony' || entry.Text === 'Odchod ze zony') {
        dateEntries.push(entry);
    }
    
})

//sort
for (const emp in result) {
    let employee = result[emp];
    
    for (const date in employee) {
        let dateEntries = employee[date];
        
        dateEntries.sort(
            function(entry1, entry2){
                return entry1.row - entry2.row;
        });    
    }    
}

//reduce
for (const emp in result) {
    let employee = result[emp];
    
    for (const date in employee) {
        let dateEntries = employee[date];
        let totalTime = 0;
        let ranges = '';
        for (var i = 0; i < dateEntries.length; i += 2) { 
            var enter = dateEntries[i];
            var exit = dateEntries[i + 1];
            
            if (enter.Text !== 'Vstup do zony') {
                throw 'not an enter';
            }
            if (exit.Text !== 'Odchod ze zony') {
                throw 'not an exit';
            }
            
            var timeEnter = new Date(enter.time);
            var timeExit = new Date(exit.time);

            totalTime += timeExit - timeEnter;
            ranges += '<' + timeEnter.getHours() + ':' + (timeEnter.getMinutes() < 10 ? '0' + timeEnter.getMinutes() : timeEnter.getMinutes()) + 
            ' - ' + timeExit.getHours() + ':' + (timeExit.getMinutes() < 10 ? '0' + timeExit.getMinutes() : timeExit.getMinutes()) + '>'
        }
        var officeSpentTime = new Date(totalTime).toISOString().substr(11, 8);
        employee[date] = officeSpentTime + ' -> ' + ranges;
         
    }    
}


//print
for (const emp in result) {
    let employee = result[emp];
    console.log('-------- ' + emp + ' --------');
    for (const date in employee) {
        console.log(date + ' -> ' + employee[date]);      
    }    
}
