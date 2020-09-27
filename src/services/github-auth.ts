import { GITHUB_AUTH_URL } from 'src/constants';
import { IGithubInfo } from 'src/models';

export const loginUser = async () => {
  const query = window.location.search.substring(1);
  const token = query ? query.split('access_token=')[1] : null;

  if (token) {
    const res = await fetch(GITHUB_AUTH_URL, {
      headers: {
        Authorization: 'token ' + token,
      },
    });

    if (res.status === 200) {
      const userData = await res.json();
      setGithubCookie(userData);
      window.location.href = '/';
      return userData.login;
    }
  }
  return '';
};

export const setGithubCookie = (res: IGithubInfo): void => {
  document.cookie = `gituser=${JSON.stringify(res)}; max-age=${60 * 60 * 24}`;
};

export const checkAuthorization = (): boolean => {
  const githubCookie = getCookie('gituser');
  return !!(githubCookie && githubCookie.hasOwnProperty('name'));
};

export const getGithubUserName = (): string => {
  const githubCookie = getCookie('gituser');
  return githubCookie.name;
};

export const getGithubLogin = (): string => {
  const githubCookie = getCookie('gituser');
  return githubCookie.login;
};

export function deleteCookie(name = 'gituser'): void {
  document.cookie = `${name}= ; max-age=-1`;
}

function getCookie(name: string): IGithubInfo {
  let matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined;
}
