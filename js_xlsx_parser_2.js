let fs = require('fs');
let csv= require('fast-csv');
const stream = require('stream');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const parseFile = util.promisify(csv.parseFile);

let readData = async function(employee) {
        
    let data = {};
    var promise = readFile('C:/' + employee + '.csv', 'utf8');
    var fileString = await promise;
    for(let row of fileString.split(';;;\r\n')) {
        let date = row.substr(0, 10);
        if (!data[date]) {
            data[date] = [];
        }

        let text = row.substr(18, 6);
        let time = row.substr(11, 5);
        data[date].push(time);
    }


    return data;
}

readData('');
readData('');











//reduce

function reduce(employee) {
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
function print(result) {
    for (const emp in result) {
        let employee = result[emp];
        console.log('-------- ' + emp + ' --------');
        for (const date in employee) {
            console.log(date + ' -> ' + employee[date]);      
        }    
    }
}

