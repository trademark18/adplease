#!/usr/bin/env node

/* dependencies */
const csv = require('csvtojson');
const Nightmare = require('nightmare');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const timeBot = require('./timeBot');

/* env vars and args */
/** @typedef {Object} EnvironmentVariables */
require('dotenv').config();

/* constants */
const ISI_CLIENT_ID = 'Archetype1';

const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';
const SITE_URL = `https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=${ISI_CLIENT_ID}`;
const TIMESHEET_BTN = '#UI4_ctBody_UCTodaysActivities_btnTimeSheet';

const ADPCOLUMN = {
	CLIENT: 'Client',
	PRACTICE: 'Practice',
	PROJECT: 'Project',
	TASK: 'Task'
}

/**
 * TODO: Make this a config file or better yet a web source (Lambda?)
 */
const COLUMNDEF = {
	OUI: {
		"Client": "OUI",
		"Practice": "Digital Experience",
		"Project": "Odysseys GMS Phase II"
	},
	A2: {
		"Client": "ASC Internal",
		"Practice": "Data & Analytics",
		"Project": "A2 Analytics"
	},
	ASC: {
		"Client": "ASC Internal",
		"Practice": "Digital Experience",
		"Project": "DX" 
	}
}

/* app */
var app = module.exports = {
	nightmareConfig: { show: true },
	rowIndex: 0,
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
		csvResult
	] = await Promise.all([
		app.initNightmarePromise(),
		app.readCsvPromise(csvPath)
	]);
	
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


app.getColumnValue = function getColumnValue(rawRow, colDefinition){
	// Get prefix
	let definitionIdentifier = rawRow.split('_')[0];
	return COLUMNDEF[definitionIdentifier][colDefinition];
} 

// init :)
app.init();
