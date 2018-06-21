const fetch = (url, options) => {
  return global.fetch(`${process.env.SERVER_URL}${url}`, {
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    ...options
  });
};

const notEmpty = x => !!x;

export const deleteJob = id => {
  return fetch(`/jobs/${id}`, { method: "DELETE" }).then(response =>
    response.json()
  );
};

export const fetchJobs = query => {
  query.limit = query.limit || 50;

  const queryString = Object.keys(query)
    .map(key => {
      const value = query[key];
      if (value === undefined) {
        return "";
      }
      return `${key}=${value}`;
    })
    .filter(notEmpty)
    .join("&");

  return fetch(`/fetchJobs?${queryString}`).then(response => {
    return response.json().then(jobs => {
      return {
        jobs,
        totalCount: response.headers.get("X-Total-Count") * 1
      };
    });
  });
};

export const fetchCities = stateId => {
  return fetch(`/fetchCities?state=${stateId}`).then(response => {
    return response.json();
  });
};

export const fetchBusinessOnSales = query => {
  query.limit = query.limit || 50;

  const queryString = Object.keys(query)
    .map(key => {
      const value = query[key];
      if (value === undefined) {
        return "";
      }
      return `${key}=${value}`;
    })
    .filter(notEmpty)
    .join("&");

  return fetch(`/fetchBusinessOnSales?${queryString}`).then(response => {
    return response.json().then(data => {
      return {
        data,
        totalCount: response.headers.get("X-Total-Count") * 1
      };
    });
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

export const createBusiness = business => {
  return fetch(`/createBusiness`, {
    headers: {},
    method: "POST",
    body: business
  }).then(response => {
    return response.json();
  });
};

export const editBusiness = business => {
  return fetch(`/editBusiness`, {
    headers: {},
    method: "POST",
    body: business
  }).then(response => {
    return response.json();
  });
};

export const incrementJobView = ({ id }) => {
  return fetch(`/incrementJobView`, {
    method: "PATCH",

    body: JSON.stringify({ id })
  }).then(response => {
    return response.json();
  });
};

export const fetchDashboardInfo = ({ state }) => {
  return fetch("/dashboardInfo" + (state ? `?state=${state}` : "")).then(
    response => response.json()
  );
};

export const incrementBusinessView = ({ id }) => {
  return fetch(`/incrementBusinessView`, {
    method: "PATCH",

    body: JSON.stringify({ id })
  }).then(response => {
    return response.json();
  });
};

export const editJob = job => {
  return fetch(`/jobs/${job.id}`, {
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
