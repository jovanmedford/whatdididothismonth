export const createPostEvent = (email, body) => {
  return {
    httpMethod: "POST",
    requestContext: {
      authorizer: {
        claims: {
          email,
        },
      },
    },
    body,
  };
};

// Taken from - https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function daysLeft() {
  let date = new Date();
  let today = date.getDate();
  return daysInMonth(date.getMonth() + 1, date.getFullYear()) - today + 1;
}

export function getSlug(sk) {
  return sk.split("#")[0];
}

export function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
