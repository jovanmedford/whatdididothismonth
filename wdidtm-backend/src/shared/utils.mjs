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
