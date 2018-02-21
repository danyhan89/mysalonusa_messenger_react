const fetch = (url, options) => {
  return global.fetch(`${process.env.SERVER_URL}${url}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });
};

export const fetchJobs = query => {
  query.limit = query.limit || 50;

  const queryString = Object.keys(query)
    .map(key => {
      const value = query[key];
      return `${key}=${value}`;
    })
    .join("&");

  return fetch(`/fetchJobs?${queryString}`).then(response => {
    return response.json();
  });
};
export const fetchChats = query => {
  query.limit = query.limit || 50;

  const queryString = Object.keys(query)
    .map(key => {
      const value = query[key];
      return `${key}=${value}`;
    })
    .join("&");

  return fetch(`/fetchChats?${queryString}`).then(response => {
    return response.json();
  });
};

export const createJob = job => {
  return fetch(`/createJob`, {
    method: "POST",

    body: JSON.stringify(job)
  }).then(response => {
    return response.json();
  });
};

export const editJob = job => {
  return fetch(`/editJob`, {
    method: "POST",

    body: JSON.stringify(job)
  }).then(response => {
    return response.json();
  });
};

export const applyForJob = ({ message, email, job }) => {
  if (!message || !email || !job) {
    throw "Specify message, email and job";
  }

  return fetch(`/applyForJob`, {
    method: "POST",
    body: JSON.stringify({ message, email, job })
  }).then(response => {
    return response.json();
  });
};

global.fetchJobs = fetchJobs;
global.createJob = createJob;
