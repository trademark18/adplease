# adplease
This application automates time entry for ADP's ezLaborManager website.  If you are required to keep granular time logs, entering the logs manually into the website is tedious, and can require a lot of time.  This application automates the data entry by ingesting a CSV representing the time logs, and then typing the data into ADP's site.

## Setup

The CSV file must match the example in the repo called `FullWeekExport.csv`

You'll need to add a `.env` file containing the values requested in `.env.example`

### Usage
`npm i`

Installs all dependencies

`npm run start:dev`

Runs the server in development mode. This command starts a nodemon server which will watch any source files and recompile when the source changes.

**(See Running the app below)**

Debugging in development mode. From VSCode, Run the attach command from the debugger menu after you have run `npm run start:dev` from the console


`npm run compile`

This command generates a dist/ folder with everything bundled/minified for use on a server.

`npm start`

Runs the server in production mode. This is the default command which runs compiled source files from the dist/ directory.

## Running the app

1. Make sure the CSV export is in the same directory as `index.js` and that it is called "FullWeekExport.csv" (TEMP)
2. Run the app in your preferred manner after following the setup steps above.
3. A browser window should appear, and the bot should enter the time.  It may take up to 5 minutes if you have a lot of data.
4. Upon finishing the entry, the app will do nothing more.  You can review the data before clicking save yourself.
5. Close the Electron window after you've clicked save and the app will close within 1s.

## Contributing
There is currently a Project in this repo with some upcoming development tasks.  Feel free to have a look and give it a go.
