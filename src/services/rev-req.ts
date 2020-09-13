import { HEROKU_URL } from '../constants';
import { IReviewRequest } from '../models';

export async function getReviewRequest() {
    try {
        const response = await fetch(`${HEROKU_URL}reviewRequests`);
        const allRequests = await response.json();
        return allRequests
    } catch (e) {
        return null
    }
  }

export async function postReviewRequest(data: IReviewRequest) {
    try {
        const rawResponse = await fetch(`${HEROKU_URL}reviewRequests`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        switch (rawResponse.status) {
          case 200:
            console.log(rawResponse.json());
            break;
          case 400:
            throw Error('Bad request');
          case 401:
            throw Error('Access token is missing or invalid');
          default:
            Error('Request error');
        }
      } catch (e) {
        console.log(e.message);
      }
}
