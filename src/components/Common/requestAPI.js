const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

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

export const makePostRequest = async (
  apiLinkSuffix,
  content = null,
  authenticate = true
) => {
  let accessToken = null;

  if (authenticate) {
    const credentials = localStorage.getItem("credentials");
    accessToken = JSON.parse(credentials).accessToken;
  }

  const headers = {};

  if (authenticate) headers.Authorization = `Bearer ${accessToken}`;
  if (content) headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(`${apiURL}/api/${apiLinkSuffix}`, {
      method: "POST",
      headers,
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      promptRequestError(response);
      return null;
    }
    return response;
  } catch (e) {
    window.alert(
      "Serveriga ei õnnestunud ühendust saada.\n" +
        "Muudatused pole salvestatud."
    );
    return null;
  }
};

export const makeGetRequest = async (apiLinkSuffix) => {
  const credentials = localStorage.getItem("credentials");
  const { accessToken } = JSON.parse(credentials);

  const response = await fetch(`${apiURL}/api/${apiLinkSuffix}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
};
