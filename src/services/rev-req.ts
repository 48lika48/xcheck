import { HEROKU_URL } from '../constants';

export async function getReviewRequest(taskId: string) {
    try {
        const response = await fetch(`${HEROKU_URL}reviewRequests`);
        const allRequests = await response.json();
        const submittedRequest = allRequests.find((ts: any) => ts.task === taskId)
        if (!submittedRequest) {
            return null
        }
        return submittedRequest
    } catch (e) {
        return null
    }

  }