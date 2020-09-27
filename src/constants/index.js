import { CLIENT_ID } from '../config';

export const GITHUB_AUTH_PAGE = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;

export const GITHUB_AUTH_URL = 'https://api.github.com/user';

export const HEROKU_URL = 'https://xcheck-db-project.herokuapp.com/';

export const FOOTER_LINKS = {
  rss: {
    link: 'https://rs.school/',
    title: 'RSS React 2020 Q3',
  },
  github: {
    link: 'https://github.com/MaksimDiubo/xcheck',
    title: 'Github',
  },
};
