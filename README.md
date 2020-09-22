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

### Steps

- Clone [repository](https://github.com/MaksimDiubo/xcheck)
- Run `npm install` (installs dependencies in the root folder.)
- Make a copy of `src/config.example.js` and rename it to `config.js`
- Create `OAuth App` in your Github account (Developer settings, set `Homepage URL`: http://localhost:4000/ and `Authorization callback URL`: http://localhost:4000/auth/user)
- Write CLIENT_ID and CLIENT_SECRET from your `OAuth App` to `config.js` file and save.
- Run `node ./src/server/auth-server.js` (start auth-server)
- Run `npm start` (start application)
- Open `https://localhost:3000` in a browser

### Code Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/MaksimDiubo/xcheck/graphs/contributors">
