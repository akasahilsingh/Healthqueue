export const getErrorMessage = (error) => {
  const serverMessage = error.response?.data?.message || error.response?.data?.error;
  const requestUrl = error.config?.url;

  if (serverMessage && error.response.status < 500) {
    return serverMessage;
  }

  if (error.response) {
    return `Server error (${error.response.status}). Please check the Render logs.`;
  }

  if (error.request) {
    return `Unable to reach the API${requestUrl ? ` at ${requestUrl}` : ""}. Check the API URL and CORS settings.`;
  }

  return "Something went wrong. Please try again.";
};