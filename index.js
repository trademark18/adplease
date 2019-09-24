#!/usr/bin/env node

/* dependencies */
const csv = require('csvtojson');
const Nightmare = require('nightmare');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

/* env vars and args */
/** @typedef {Object} EnvironmentVariables */
require('dotenv').config();

/* constants */
const ISI_CLIENT_ID = 'Archetype1';

const DATE_COL_NAME_BASE = '#INTIMEdt_';
const BTN_COL_NAME_BASE = '#BtnInsertRow_';
const IN_COL_NAME_BASE = '#INTIMEtm_';
const OUT_COL_NAME_BASE = '#OUTTIMEtm_';

/* app */
var app = module.exports = {
	nightmareConfig: { show: true },
	rowIndex: 0,
	addedRowIndex: 14 // 13 + 1
};

/** init */
app.init = function init() {
	//parse args
	app.arguments = app.getArguments();

	const csvPath = app.arguments._[0];

	//start up processes
	const promises = [
		app.initNightmarePromise(),
		app.readCsvPromise(csvPath)
	];

	Promise.all(promises)
		.then(([nightmareResult, csvResult]) => {
			//I have no idea where nightmareResult is coming from
			console.log(app.nightmare);

			// console.log(csvResult);
		});
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
app.initNightmarePromise = function initNightmarePromise() {
	app.nightmare = Nightmare(app.nightmareConfig);

	const ret = app.nightmare
		.authentication(process.env.ADP_USERNAME, process.env.ADP_PASSWORD)
		.goto(`https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=${ISI_CLIENT_ID}`)
		.click('#UI4_ctBody_UCTodaysActivities_btnTimeSheet')
		.wait('#INTIMEdt_0');

	//todo - verify that adp is pointing at this week

	return ret;
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
					name: row.Name,
					start: moment(row.Start, 'M/DD/YYYY h:mm:ss A'),
					end: moment(row.End, 'M/DD/YYYY h:mm:ss A')
				};

				return newRow;
			});

			newCsvResult.sort((a, b) => a.valueOf() - b.valueOf());

			return newCsvResult;
		});

	return ret;
};

// init :)
app.init();
