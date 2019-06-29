const Nightmare = require('nightmare')
const moment = require('moment');
const csv = require('csv-parse');
require('dotenv').config(); // Currently requires: ADP_USERNAME, ADP_PASSWORD
const parser = csv();
const fs = require('fs');
const nightmare = Nightmare({ show: true })


const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';

var rowIndex = 0;
var addedRowIndex = 14; // 13 + 1

var rawCsv = fs.readFileSync('FullWeekExport.csv', 'utf8');

//Remove the quotes
rawCsv = rawCsv.replace(/"/g, '');

// Launch the browser and navigate to the time entry screen of death and despair
nightmare
    .authentication(process.env.ADP_USERNAME, process.env.ADP_PASSWORD) // Put username and password here
    .goto('https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=Archetype1')
    .click('#UI4_ctBody_UCTodaysActivities_btnTimeSheet')
    .then(function(){
        // Read the input file
        parser.write(rawCsv);
    })
  //.then(nightmare.end().then(console.log))

var timeRows = new Array();

parser.on('readable', function(){
    let record;
    while(record = parser.read()){
        timeRows.push(record);
    }
    
    // Remove the headers
    timeRows.shift();

    // Reverse the records to be date ASC
    timeRows.reverse();

    processRecords();
})

function processRecords(){
    timeRows.forEach(x => typeInRow({
        name: x[0],
        start: moment(x[1]),
        end: moment(x[2])
    }));
 }

function typeInRow(record){
    // Check the date of the current row against the current record and see if we need to add a row
    var dateColName = DATE_COL_NAME_BASE + rowIndex;

    getCurrentRowDate(dateColName, function(dateRow){

        let rowDate = moment(dateRow);
        let recordDate = moment(record.start);
        let sameDay = rowDate.isSame(recordDate, 'day');
        
        if(!sameDay && rowDate.add(-1, 'day').isSame(recordDate, 'day')){
            // Can't put record on current row!
            console.log('Must add a row');
            console.log('selector name: ', BTN_COL_NAME_BASE + (rowIndex - 1))
            nightmare
                .click(BTN_COL_NAME_BASE + (rowIndex - 1))
                .then(function(){
            });
            return record;
        }
        else {
            console.log('Ready to insert values');
        }
    })
    
    enterData(record);
}

function enterData(record, callback){
    nightmare
        .click(IN_COL_NAME_BASE + rowIndex)
        .wait(100)
        .type(IN_COL_NAME_BASE + rowIndex, record.start.format('h:mma'))
        .wait(100)
        .click(OUT_COL_NAME_BASE + rowIndex)
        .wait(100)
        .type(OUT_COL_NAME_BASE + rowIndex, record.end.format('h:mma'))
        .then(callback)
//        .end().then(console.log);
}


function getCurrentRowDate(dateColName, callback){
    nightmare
        .evaluate(dateColName => {
            return document.querySelector(dateColName).innerText
        }, dateColName)
        .then(callback);
}


// TODO: Track the index of the current input (like #INTIMEtm_0)
    // Add a row if necessary
// Calculate the index of the new row (original rows - 1 + added rows)
// Insert the record into the row