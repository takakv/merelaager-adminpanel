export const fetchAccessToken = () => {
  const credentials = localStorage.getItem("credentials");
  return JSON.parse(credentials).accessToken;
};
