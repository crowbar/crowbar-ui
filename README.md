# Welcome to Crowbar Angular Prototype
[![Build Status](https://travis-ci.org/crowbar/crowbar-ui.svg?branch=master)](https://travis-ci.org/crowbar/crowbar-ui)

### Setting up a development environment with Docker

This is an optional way to develop on `crowbar-ui` within a contained environment. The main benefit is to have some reusable and host-independent environment to develop on.

1. make sure `docker` is installed and the `docker` daemon is running.

   for installation details see: https://docs.docker.com/engine/installation/
2. build the image from the [Dockerfile](Dockerfile):
  ```
  docker build -t crowbar-ui .
  ```
3. run the container (`pwd` should be your git clone):
  ```
  docker run -d --name "crowbar-ui_container" -v $(pwd)/assets:/crowbar-ui/assets -v $(pwd)/routes:/crowbar-ui/routes -p 3000:3000 crowbar-ui
  ```
4. work on the assets folder in your local git clone and the changes will be immediately visible in the browser.
   also if you are changing the `./routes` directory the server inside the container gets restarted by `nodemon`

#### Running the test suite inside the container
```
docker exec -ti crowbar-ui_container npm test
```

### First steps to have the app running locally for PRODUCTION ENV only:

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

`NODE_ENV=production bower install`

7 - Let Gulp build the public folder for your assets (it will keep watching for changes, so yes, after this, you are ready to start making changes in the front-end), note that this will exit with a warning if cloud.config.json is missing (it will continue to run if `NODE_ENV` is not set to production):

`NODE_ENV=production gulp`

8 - Update the `tested_step` variable in `routes/api/upgrade.js` depending on the scenario you want to test. This is used to properly fill the mocked status API response.

9 - Run the server at http://localhost:3000 with (you will need to restart it every time you make changes in the backend, but not in the layout or front-end in general):

`NODE_ENV=production npm start`

#### Need Development ENV? Perform the following replacing the steps 6, 7, and 8:

1 - Everytime you update master from new PR merged into it, make sure you have all the latest libraries from package.json by running

`npm install`

2 - and then, in a new terminal:

`bower install && gulp`

to compile all your assets again and leave it watching your changes.

#### Latest build/run info:

The most up to date source of setup information is `.travis.yml` in the base folder, as this builds/runs the test suite and must be up to date. Check there first if you encounter any issues with running the build locally

### That's it fellas! .. enjoy coding! ###

:)

!['bring it on'](http://s2.quickmeme.com/img/0b/0bf4e6e37c1539469cf8adc3e3a63b98e3943ad3ee72bd2d9c8de9ba22eefdd2.jpg)
