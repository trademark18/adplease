#!/usr/bin/env node

/* dependencies */
const csv = require('csvtojson');
const Nightmare = require('nightmare');
const moment = require('moment');
const fetch = require('node-fetch');
const path = require('path');

const timeBot = require('./timeBot');

/* env vars and args */
/** @typedef {Object} EnvironmentVariables */
require('dotenv').config();

/* constants */
const ISI_CLIENT_ID = 'Archetype1';

const SITE_URL = `https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=${ISI_CLIENT_ID}`;
const COL_DEF_URL = 'https://gist.githubusercontent.com/trademark18/be725a7b4a0dff8a9b6643c0f480f857/raw/columnDefinitions.json';
const TIMESHEET_BTN = '#UI4_ctBody_UCTodaysActivities_btnTimeSheet';

const ADPCOLUMN = {
	CLIENT: 'Client',
	PRACTICE: 'Practice',
	PROJECT: 'Project',
	TASK: 'Task'
}

/* app */
var app = module.exports = {
	nightmareConfig: { show: true },
	rowIndex: 0,
	colDef: undefined,
	nightmare: undefined,
	addedRowIndex: 14 // 13 + 1
};

/** init */
app.init = async function init() {
	//parse args
	app.arguments = app.getArguments();

	const csvPath = app.arguments._[0];

	//start up processes
	[
		_,
		app.colDef
	] = await Promise.all([
		app.initNightmarePromise(),
		app.initColDefPromise(),
	]);

	// Promise can't be part of Promise.all because it must run after initColDefPromise finishes()
	let csvResult = await app.readCsvPromise(csvPath)

	await timeBot.enterTime(app.nightmare, csvResult);

	// Once we've entered the time, we want the user to click the submit button in the browser
    // So basically we want to keep the Nightmare going and not end the program.
    while(app.nightmare.proc.exitCode === null)
    {
        // Check again in a second to see if user closed the Electron window
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

	// We done.
    process.exit();

};

/** get arguments */
app.getArguments = function getArguments() {
	const ret = require('yargs')
		.usage('Usage: $0 <csvFile>')
		.demandCommand(1, 'Error: You must pass a csv file to use')
		.argv;

	return ret;
};

/** start nightmare */
app.initNightmarePromise = async function initNightmarePromise() {
	app.nightmare = Nightmare(app.nightmareConfig);

	await app.nightmare
		.authentication(process.env.ADP_USERNAME, process.env.ADP_PASSWORD)
		.goto(SITE_URL)
		.click(TIMESHEET_BTN)
		.wait('#INTIMEdt_0');

	return;
}


/**
 * Retrieve the GitHub Gist file containing the column definitions
 * That respository is used as a maintainable source for adding new available prefixes
 * to represent new sets of values for the column values it provides.
 * @returns {Object} The column definition from the repository 
 */
app.initColDefPromise = async function initColDefPromise(){
	let jsonResult;
	
	await fetch(COL_DEF_URL)
		.then(res => jsonResult = res.json());
	
	return jsonResult;
}

/** read csv file */
app.readCsvPromise = function readCsvPromise(csvPath) {
	app.csv = csv();

	//turn relative csvPath into full path
	let fullPath = csvPath;

	if(!path.isAbsolute(fullPath))
		fullPath = path.join(__dirname, fullPath);

	//read file and return a promise that resolves with json
	const ret = app.csv
		.fromFile(csvPath)
		.then(csvResult => {
			const newCsvResult = csvResult.map(row => {
				const newRow = {
					client: app.getColumnValue(row.Name, ADPCOLUMN.CLIENT),
					practice: app.getColumnValue(row.Name, ADPCOLUMN.PRACTICE),
					project: app.getColumnValue(row.Name, ADPCOLUMN.PROJECT),
					task: row.Name.split('_')[1],
					start: moment(row.Start, 'M/DD/YYYY h:mm:ss A'),
					end: moment(row.End, 'M/DD/YYYY h:mm:ss A')
				};

				return newRow;
			});

			return newCsvResult;
		});

	return ret;
};

/**
 * getColumnValue
 * Get the value for the predefined columns like project/practice/client, etc.
 * @param {string} rawTaskName The task name in the raw format Ex. "OUI_5749 - OUI"
 * @param {string} columnName The name of the column for which to retrieve the value (enum)
 * @returns {string} The value to be used in columnName
 */
app.getColumnValue = function getColumnValue(rawTaskName, columnName){
	// Get prefix
	// rawTaskName is in the format "definitionIdentifier_taskName" Ex. "OUI_5749 - OUI" 
	let definitionIdentifier = rawTaskName.split('_')[0];
	return app.colDef[definitionIdentifier][columnName];
} 

// init :)
app.init();
