export const getErrorMessage = (error, backendUrl) => {
  const serverMessage = error.response?.data?.message || error.response?.data?.error;

  if (serverMessage) {
    return serverMessage;
  }

  if (error.response) {
    return `Request failed (${error.response.status} ${error.response.statusText || "Unknown error"})`;
  }

  if (error.request) {
    return `Network error: could not reach ${backendUrl}. Check that the backend is running and that the URL is correct.`;
  }

  return error.message || "Something went wrong";
};