# Cash Counter

## Installation

The project requires you have mongodb installed, it will use by default port `27017`.
Check out `app/configs/dev.json`.
Project dependencies can be installed through:

`npm install`

## Startup 

To start the app run:

`npm start`

## Running tests

Tests run in a different node port, so server never needs to stop since test will start and shutdown its own required server.
To keep running lint + all tests, open a new terminal and run:

`npm run dev`

This ^ will make you keep listening to changes in any file, the debounce default is 10 seconds. 
There are two types of tests, unit and api (e2e).
Each type of tests generates its own coverage report. When running all tests coverages will be merged into a single final report.
The following commands are used to run tests:

`npm run test` // to run all tests
`npm run test:ut` // to run unit tests
`npm run test:api` // to run api tests

Coverage reports can be found inside test folder:

`test/coverage`
`test/coverage/all-coverage`
`test/coverage/ut-coverage`
`test/coverage/api-coverage`

## Linter

The linter runs only when `all-tests` run, 
