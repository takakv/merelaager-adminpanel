const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export const makePostRequest = async (apiLinkSuffix) => {
  const credentials = localStorage.getItem("credentials");
  const accessToken = JSON.parse(credentials).accessToken;

  const response = await fetch(`${apiURL}/api/` + apiLinkSuffix, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
};

export const makeGetRequest = async (apiLinkSuffix) => {
  const credentials = localStorage.getItem("credentials");
  const accessToken = JSON.parse(credentials).accessToken;

  const response = await fetch(`${apiURL}/api/` + apiLinkSuffix, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
}

export const promptRequestError = (response) => {
  window.alert(
    "Midagi läks nihu." +
      "\n\n" +
      `Veakood: ${response.status}` +
      "\n" +
      `Kirjeldus: ${response.statusText}`
  );
  console.log(response);
};
