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

Both, API and WebApp were built using NodeJS technologies.

API was built with [Loopback](https://loopback.io/) framework while WebApp is using [React](https://reactjs.org/).

## Setup

First install NodeJS and NPM

For API:

1. Install the Loopback framework client running: `npm install -g loopback-cli`
1. Jump into api folder: `cd api`
1. Install dependencies: `npm install`

For Web Application:

1. Jump into web-app folder: `cd web-app`
1. Install the dependencies: `npm install`

## Run

_Coming soon_

## Deploy

_Coming soon_