# Welcome to Crowbar Angular Prototype
[![Build Status](https://travis-ci.org/crowbar/crowbar-ui.svg?branch=master)](https://travis-ci.org/crowbar/crowbar-ui)

##### First steps to have the app running locally for PRODUCTION ENV only:

1 - Clone the app from GitHub:

`git@github.com:crowbar/crowbar-ui.git`

2 - Locate yourself into the recently created folder:

`cd crowbar-ui`

**Make sure you have Node.js installed in your machine with NPM, if not, please proceed to install it before continuing with the following steps. (more info: https://nodejs.org/en/download/)**

3 - Let npm install all the needed packages:

`npm install`

4 - Some packages, like gulp, needs to be installed globally to be available through the console. Let's install them:

`sudo npm install -g gulp`

5 - You will need to have Bower installed globally in your machine:

`npm install -g bower`

6 - Let bower fetch all our dependencies:

`NODE_ENV=production npm run preinstall`

7 - Let Gulp build the public folder for your assets (it will keep watching for changes, so yes, after this, you are ready to start making changes in the front-end):

`NODE_ENV=production npm run postinstall`

8 - Run the server at http://localhost:3000 with (you will need to restart it every time you make changes in the backend, but not in the layout or front-end in general):

`NODE_ENV=production npm start`

#### Need Development ENV? Perform the following replacing the steps 6, 7, and 8:

1 - Everytime you update master from new PR merged into it, make sure you have all the latest libraries from package.json by running

`npm install`

2 - and then, in a new terminal:

`npm run preinstall && npm run postinstall`

to compile all your assets again and leave it watching your changes.

### That's it fellas! .. enjoy coding! ###

:)

!['bring it on'](http://s2.quickmeme.com/img/0b/0bf4e6e37c1539469cf8adc3e3a63b98e3943ad3ee72bd2d9c8de9ba22eefdd2.jpg)
