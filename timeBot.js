/**
 * Set up constants which represent DOM-related string values
 */
const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';
const CLIENT_COL_NAME_BASE = '#TR_{0} td:nth-child(12) a';
const PRACTICE_COL_NAME_BASE = '#TR_{0} td:nth-child(13) a';
const PROJECT_COL_NAME_BASE = '#TR_{0} td:nth-child(14) a';
const TASK_COL_NAME_BASE = '#TR_{0} td:nth-child(15) a';

/**
 * Set up indices used to track the row in ADP
 */
var origIndex = 0;
var addedIndex = 14;
var activeIndex = 0;

// Nightmare object
var nm;

exports.enterTime = async function (nightmareResult, entries) {
    nm = nightmareResult;

    // Sequentially type in each row
    for(let i=0; i<entries.length; i++){
        // Prepare row for time entry
        await processRecord(entries[i]);

        // Enter time on row
        await enterTimeOnRow(entries[i]);
    }
}

/**
 * @async
 * Prepare rows in the DOM for insertion of record
 * @param {Object} record The record for the time entry row
 */
async function processRecord(record) {
    
        // Check the date of the current row against the current record and see if we need to add a row
        let dateColName = `${DATE_COL_NAME_BASE}${origIndex}`;

        // Get the date of the current row on the DOM
        let date = await nm
            .evaluate(dateColName => {
                return document.querySelector(dateColName).innerText
            }, dateColName);
            
        // If the date is today, then manage the index and proceed.
        if (date === record.start.format("MM/DD/YYYY")) {
            console.log(`Matched row date ${date} with record date ${record.start.format("MM/DD/YYYY")} with index ${origIndex}`);
            activeIndex = origIndex++;
        }
        else {
            // New row is needed before insertion.
            await addRow();

            activeIndex = addedIndex++;
        }

        return; 
    };


/**
 * @async
 * Add a new row to the grid
 */
async function addRow(){
    await nm.click(`${BTN_COL_NAME_BASE}${activeIndex}`);
    console.log(`Added new row at index ${addedIndex}`);
}


/**
 * @async
 * Type values into the row
 * @param {Object} record The object containing values to be entered on the row
 */
async function enterTimeOnRow(record){

    let startTimeInput = `${IN_COL_NAME_BASE}${activeIndex}`;
    let endTimeInput = `${OUT_COL_NAME_BASE}${activeIndex}`;
    let clientInput = `${CLIENT_COL_NAME_BASE.replace('{0}', activeIndex)}`;
    let practiceInput = `${PRACTICE_COL_NAME_BASE.replace('{0}', activeIndex)}`;
    let projectInput = `${PROJECT_COL_NAME_BASE.replace('{0}', activeIndex)}`;
    let taskInput = `${TASK_COL_NAME_BASE.replace('{0}', activeIndex)}`;


    await nm
        .click(startTimeInput)
        .wait(100)
        .type(startTimeInput, record.start.format("LT")) // "9:45 AM"
        .wait(100)

        .click(endTimeInput)
        .wait(100)
        .type(endTimeInput, record.end.format("LT"))
        .wait(100)

        .click(clientInput)
        .wait(100)
        .type(clientInput, record.client)
        .wait(100)
        
        .click(practiceInput)
        .wait(100)
        .type(practiceInput, record.practice)
        .wait(100)

        .click(projectInput)
        .wait(100)
        .type(projectInput, record.project)
        .wait(100)

        .click(taskInput)
        .wait(100)
        .type(taskInput, record.task)
        .wait(100)

        // Potential enhancement: select an item from the zoom layer that appears
        //.wait('#FLZoomLayer')
        //.press(taskInput, 'Down') // Down arrow
}