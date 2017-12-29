export const fetchChats = query => {
  query.limit = query.limit || 50;

  const queryString = Object.keys(query)
    .map(key => {
      const value = query[key];
      return `${key}=${value}`;
    })
    .join("&");

  return fetch(`${process.env.SERVER_URL}/fetchChats?${queryString}`).then(
    response => {
      return response.json();
    }
  );
};

export const createJob = job => {
  return fetch(`${process.env.SERVER_URL}/createJob`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(job)
  }).then(response => {
    return response.json();
  });
};

export const applyForJob = ({ message, email, job }) => {
  if (!message || !email || !job) {
    throw "Specify message, email and job";
  }

  return fetch(`${process.env.SERVER_URL}/applyForJob`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, email, job })
  }).then(response => {
    return response.json();
  });
};

global.createJob = createJob;
