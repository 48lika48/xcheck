import axios from 'axios'

export async function getTasks() {
  const url = `https://xcheck-db-project.herokuapp.com/tasks`
  const { data } = await axios.get(url)
  return data
}

export async function getReviewRequests() {
  const url = `https://xcheck-db-project.herokuapp.com/reviewRequests`
  const { data } = await axios.get(url)
  return data
}

export async function getReviews() {
  const url = `https://xcheck-db-project.herokuapp.com/reviews`
  const { data } = await axios.get(url)
  return data
}
