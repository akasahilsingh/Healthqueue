export const getErrorMessage = (error) => {
  const serverMessage = error.response?.data?.message || error.response?.data?.error;

  if (serverMessage && error.response.status < 500) {
    return serverMessage;
  }

  if (error.response) {
    return "The server could not complete your request. Please try again later.";
  }

  if (error.request) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
};