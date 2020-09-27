# X Check App / RS Assessment Tool

---

## Technology stack

- Typescript
- React
- Node.js

---

## Getting Started

### Prerequisites

- [Git 2.10+](https://git-scm.com/downloads)
- [NodeJS LTS](https://nodejs.org/en/)

### Steps to develop

- Clone [repository](https://github.com/MaksimDiubo/xcheck)
- Run `npm install` (installs dependencies in the root folder.)
- Make a copy of `./src/config.example.js` and rename it to `config.js`
- Create `OAuth App` in your Github account (Developer settings, set `Homepage URL`: http://localhost:4000/ and `Authorization callback URL`: http://localhost:4000/auth/user)
- Write CLIENT_ID and CLIENT_SECRET from your `OAuth App` to `config.js` file and save.
- Run `node ./src/server/auth-server.js` (start auth-server)
- Run `npm start` (start application)
- Open `https://localhost:3000` in a browser

### Steps to deploy

- Run `npm run build` (creating build directory with a production build of app)
- Deploy app to `gh-pages`, or `heroku`, or `netlify`, or any other service
- [Deploy the full fake REST API json-server ](https://github.com/jesperorb/json-server-heroku)
- Set a redirect address (of the deployed site) in the file `auth-server.js` instead of the address `http://localhost:3000` and [deploy](https://devcenter.heroku.com/articles/deploying-nodejs) this file as a server for authorization
- Create `OAuth App` in your Github account (Developer settings, set `Homepage URL`: http://`your-auth-server`/ and `Authorization callback URL`: http://`your-auth-server`/auth/user)

---

### App features

#### User roles

- student (create request to check, review the work of other students, open a dispute)
- author (create tasks, edit tasks, etc ...)
- supervisor (all application features are available, etc ...)
- course manager (create tasks, edit tasks, starting a crosscheck session, etc ...)

#### Import/export tasks

- import [RSS Checklist](https://github.com/rolling-scopes-school/checklist) .json format tasks
- import markdown tasks (format [english-puzzle.md](https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/rslang/english-puzzle.md), [speakit.md](https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/rslang/speakit.md), [rslang.md](https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/rslang/rslang.md))
- export and import own .json tasks format
