const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export const requestTokenRefresh = async () => {
  const credentials = JSON.parse(localStorage.getItem("credentials"));
  const { refreshToken } = credentials;

  const responseRaw = await fetch(`${apiURL}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  const responseParsed = await responseRaw.json();
  if (responseRaw.ok) {
    credentials.accessToken = responseParsed.accessToken;
    localStorage.setItem("credentials", JSON.stringify(credentials));
    return true;
  }

  localStorage.clear();
  return false;
};

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
