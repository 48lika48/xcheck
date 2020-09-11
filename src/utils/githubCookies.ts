import { IGithubInfo } from 'src/models';

export const setGithubCookie = (res: IGithubInfo) => {
  document.cookie = `gituser=${JSON.stringify(res)}; max-age=${60 * 60 * 24}`;
};

export const checkGihubCookie = () => {
  const githubCookie = getCookie('gituser');
  return !!(githubCookie && githubCookie.indexOf('name'));
};

export const getGithubUserName = () => {
  const githubCookie = getCookie('gituser');
  return JSON.parse(githubCookie || '').name;
};

export function deleteCookie(name = 'gituser') {
  document.cookie = `${name}= ; max-age=-1`;
}

function getCookie(name: string) {
  let matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
