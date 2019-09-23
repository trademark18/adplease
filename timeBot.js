const moment = require('moment');

const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';

var origRowIndex = 0;

var nm;

exports.enterTime = function(nightmareResult, entries){
    nm = nightmareResult;
    entries.forEach(typeInRow);
}

function typeInRow(record){
    // Check the date of the current row against the current record and see if we need to add a row
    var dateColName = DATE_COL_NAME_BASE + origRowIndex;

    rowDatePromise(dateColName)
    .then(function(data){
        var currentDate = record.start.format("MM/DD/YYYY");
        if(data === currentDate){
            console.log("Found correct line for entry");
        }
        else{
            console.log("Need to make a new line for this entry");
        }

    })
    .then(console.log)
    .catch(console.log);


    // let rowDate = moment(dateRow);
    // let recordDate = moment(record.start);
    // recordDate.add(7, 'day'); // TEMP
    // let sameDay = rowDate.isSame(recordDate, 'day');
    
    // if(!sameDay && rowDate.add(-1, 'day').isSame(recordDate, 'day')){
    //     // Can't put record on current row!
    //     if(!hasSwitchedIndex) {
    //         rowIndex = addedRowIndex;
    //         console.log(`switching from origRowIndex ${origRowIndex} to addedRowIndex ${addedRowIndex}`);
    //     }
    //     else 
    //         rowIndex = addedRowIndex++;

    //     hasSwitchedIndex = true;
    //     console.log('Must add a row');
    //     console.log('selector name: ', BTN_COL_NAME_BASE + (origRowIndex - 1))
    //     await addRow();
    // }
    // else {
    //     if(hasSwitchedIndex) {
    //         console.log(`switching from addedRowIndex ${addedRowIndex} to origRowIndex ${origRowIndex}`);
    //         rowIndex = origRowIndex;
    //     }

    //     hasSwitched = false;
    //     rowIndex++;
    //     console.log('Ready to insert values');
    // }
    
    // await enterData(record);
}

var rowDatePromise = function (dateColName) {
    return new Promise(function (resolve, reject) {
        nm
            .evaluate(dateColName => {
                return document.querySelector(dateColName).innerText
            }, dateColName)
            .then(resolve)
            .catch(reject);
    });
}