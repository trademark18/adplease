const Nightmare = require('nightmare')
const moment = require('moment');
var CsvReader = require('promised-csv');
var reader = new CsvReader();
require('dotenv').config(); // Currently requires: ADP_USERNAME, ADP_PASSWORD
//const fs = require('fs');
const nightmare = Nightmare({ show: true })


const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';

var origRowIndex = 0;
var addedRowIndex = 14; // 13 + 1
var hasSwitchedIndex = false;

var rowIndex = 0;

//var rawCsv = fs.readFileSync('FullWeekExport.csv', 'utf8');

//Remove the quotes
//rawCsv = rawCsv.replace(/"/g, '');

// Launch the browser and navigate to the time entry screen of death and despair
nightmare
    .authentication(process.env.ADP_USERNAME, process.env.ADP_PASSWORD) // Put username and password here
    .goto('https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=Archetype1')
    .click('#UI4_ctBody_UCTodaysActivities_btnTimeSheet')
    .then(function(){
        // Read the input file
        reader.read('FullWeekExport.csv')
        .then(function(){
            // Remove the headers
            timeRows.shift();
            // Reverse the records to be date ASC
            timeRows.reverse();
            processRecords();
        })
    })
  //.then(nightmare.end().then(console.log))

var timeRows = new Array();

reader.on('row', function(data){
    timeRows.push(data);
})

async function processRecords(){
    for(const x of timeRows){
        await typeInRow({
            name: x[0],
            start: moment(x[1]),
            end: moment(x[2])
        });
        ++origRowIndex;
        //console.log("done!");
    }
    
    // timeRows.forEach(x => typeInRow({
    //     name: x[0],
    //     start: moment(x[1]),
    //     end: moment(x[2])
    // }));
 }

async function typeInRow(record){
    // Check the date of the current row against the current record and see if we need to add a row
    var dateColName = DATE_COL_NAME_BASE + origRowIndex;

    getCurrentRowDate(dateColName, async function(dateRow){

        let rowDate = moment(dateRow);
        let recordDate = moment(record.start);
        recordDate.add(7, 'day'); // TEMP
        let sameDay = rowDate.isSame(recordDate, 'day');
        
        if(!sameDay && rowDate.add(-1, 'day').isSame(recordDate, 'day')){
            // Can't put record on current row!
            if(!hasSwitchedIndex) {
                rowIndex = addedRowIndex;
                console.log(`switching from origRowIndex ${origRowIndex} to addedRowIndex ${addedRowIndex}`);
            }
            else 
                rowIndex = addedRowIndex++;

            hasSwitchedIndex = true;
            console.log('Must add a row');
            console.log('selector name: ', BTN_COL_NAME_BASE + (origRowIndex - 1))
            await addRow();
        }
        else {
            if(hasSwitchedIndex) {
                console.log(`switching from addedRowIndex ${addedRowIndex} to origRowIndex ${origRowIndex}`);
                rowIndex = origRowIndex;
            }

            hasSwitched = false;
            rowIndex++;
            console.log('Ready to insert values');
        }
    })
    
    await enterData(record);
}

async function addRow(){
    nightmare
        .click(BTN_COL_NAME_BASE + (origRowIndex - 1))
        .then(function(){
            return;
        })
}

async function enterData(record){
    console.log('Entering on index', rowIndex);
    await nightmare
        .click(IN_COL_NAME_BASE + rowIndex)
        .wait(400)
        .type(IN_COL_NAME_BASE + rowIndex, record.start.format('h:mma'))
        .wait(100)
        .click(OUT_COL_NAME_BASE + rowIndex)
        .wait(400)
        .type(OUT_COL_NAME_BASE + rowIndex, record.end.format('h:mma'))
        .wait(100);
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