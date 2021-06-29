# Table of contents

- [Intro](#intro)
- [Tecnologies used](#tecnologies-used)
- [Setup](#setup)
- [Run](#run)
- [Deploy](#deploy)

## Intro

This project is a new version from my older project [gestor-financeiro](https://github.com/lczapparolli/gestor-financeiro). There are some main reasons for starting this from scratch:

1. New modeling of database. Some assumptions made at the begining of the first project were not real anymore, so I realize that the changing the actual codebase could be more painful then writing a new application.
1. I wish to create a Progressive Web App and after some research I discovered that the Ruby on Rails could not be the best framework to do it.
1. I did a lot of bad practices that I should fix to make a better application.
1. The UI was not as pleasant as I wanted and the usability desired would be hard to achieve without and API.
1. Since the front-end should be recreated, could be better use a similar technology for back-end too, soo I decided to move to NodeJS environment.

## Tecnologies used

This API is built with NodeJS environment and uses the following packages:

- [Express](https://expressjs.com/) framework for server
- [Gulp](https://gulpjs.com/) for task automation
- [Sequelize](http://docs.sequelizejs.com/) for ORM
- [Mocha](https://mochajs.org) for test running
- [Chai](https://www.chaijs.com/) for test assertions

## Setup

1. Install NodeJS and NPM
1. Install Sqlite database
1. Install dependencies: `npm install`

## Run

Just run `npm start` or `npm test`

Run `node_modules/.bin/gulp --tasks` for more options

## Deploy

_Coming soon_