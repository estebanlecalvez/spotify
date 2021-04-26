# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## What is Spotify Like

This is an application created for a coding challenge provided by Timwi consulting. The goal is to recreate some spotify's basics features using their API.

## How to use

To gain access to spotify API, you'll need to login with Spotify by clicking on the "Login to spotify" button.

Once you are successfully connected, you will be able to search through albums.

You can also add an album to your favorites by clicking on the star Icon below his release date.

You will recover your favorites album by clicking on the 3 stars icons on the right of the search box.

### To improve:

- Calculate the total duration of an album by iterating through its tracks and additioning their duration.
- Add the possibility to add some tags to the albums on the favorites page.
- Refactoring the code to increase its readability and maintainability
(like making a component Album which returns a card with all informations / a component for the topbar which contains )
- Adding some tests with jest and some test ids to the application to test this well.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

