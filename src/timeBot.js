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
let origIndex = 0;
let addedIndex = 14;
let activeIndex = 0;

// Nightmare object
let nm;

const enterTime = async (nightmareResult, entries) => {
  nm = nightmareResult;

  // Check to see what the addedIndex should be
  addedIndex = await nm.evaluate(() => document.querySelectorAll('*[id^="BtnInsertRow_"]').length);

  // Sequentially type in each row
  for (let i = 0; i < entries.length; i++) {
    // Prepare row for time entry
    await processRecord(entries[i]);

    // Enter time on row
    await enterTimeOnRow(entries[i]);
  }
};

/**
 * @async
 * Prepare rows in the DOM for insertion of record
 * @param {Object} record The record for the time entry row
 */
async function processRecord(record) {
  // Check the date of the current row against the current record and see if we need to add a row
  const dateColName = `${DATE_COL_NAME_BASE}${origIndex}`;

  // Get the date of the current row on the DOM
  const date = await nm
    .evaluate((dateColName) => document.querySelector(dateColName).innerText, dateColName);

  // If the date is today, then manage the index and proceed.
  if (date === record.start.format('MM/DD/YYYY')) {
    console.log(`Matched row date ${date} with record date ${record.start.format('MM/DD/YYYY')} with index ${origIndex}`);
    activeIndex = origIndex++;
  } else {
    // New row is needed before insertion.
    await addRow();

    activeIndex = addedIndex++;
  }
}


/**
 * @async
 * Add a new row to the grid
 */
async function addRow() {
  await nm.click(`${BTN_COL_NAME_BASE}${activeIndex}`);
  console.log(`Added new row at index ${addedIndex}`);
}


/**
 * @async
 * Type values into the row
 * @param {Object} record The object containing values to be entered on the row
 */
async function enterTimeOnRow(record) {
  const startTimeInput = `${IN_COL_NAME_BASE}${activeIndex}`;
  const endTimeInput = `${OUT_COL_NAME_BASE}${activeIndex}`;
  const clientInput = `${CLIENT_COL_NAME_BASE.replace('{0}', activeIndex)}`;
  const practiceInput = `${PRACTICE_COL_NAME_BASE.replace('{0}', activeIndex)}`;
  const projectInput = `${PROJECT_COL_NAME_BASE.replace('{0}', activeIndex)}`;
  const taskInput = `${TASK_COL_NAME_BASE.replace('{0}', activeIndex)}`;


  await nm
    .click(startTimeInput)
    .wait(100)
    .type(startTimeInput, record.start.format('LT')) // "9:45 AM"
    .wait(100)

    .click(endTimeInput)
    .wait(100)
    .type(endTimeInput, record.end.format('LT'))
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
    .wait(100);

  // Potential enhancement: select an item from the zoom layer that appears
  // .wait('#FLZoomLayer')
  // .press(taskInput, 'Down') // Down arrow
}

export {
  enterTime,
};
