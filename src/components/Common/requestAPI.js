import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useDispatch } from "react-redux";

export const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.merelaager.ee";

// https://daveceddia.com/access-redux-store-outside-react/#option-3-use-middleware-and-intercept-an-action
let currentAuthToken = null;

export const setToken = (token) => {
  currentAuthToken = token;
};

export const clearToken = () => {
  currentAuthToken = null;
};

export const getToken = () => currentAuthToken;

export const requestTokenRefresh = async () => {
  const responseRaw = await fetch(`${apiURL}/api/auth/token/`, {
    method: "POST",
    credentials: "include",
  });

  const responseParsed = await responseRaw.json();
  return responseRaw.ok ? responseParsed.accessToken : null;
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

const checkLogin = (res) => {
  if (!res) return true;

  if (res.error.code === "InvalidAuthenticationToken") {
    clearToken();
    window.location.reload();
    return false;
  }

  return true;
};

export const makePostRequest = async (
  apiLinkSuffix,
  content = null,
  authenticate = true
) => {
  const headers = {};

  if (authenticate) headers.Authorization = `Bearer ${currentAuthToken}`;
  if (content) headers["Content-Type"] = "application/json";

  let response;

  const reqContent = {
    method: "POST",
    headers,
  };

  if (content !== null) {
    reqContent.body = JSON.stringify(content);
  }

  try {
    response = await fetch(`${apiURL}/api${apiLinkSuffix}`, reqContent);
  } catch (e) {
    window.alert(
      "Serveriga ei õnnestunud ühendust saada.\n" +
        "Muudatused pole salvestatud."
    );
    return null;
  }

  if (!response.ok) {
    const json = await response.json();
    if (!checkLogin(json)) return null;

    promptRequestError(response);
    return null;
  }

  return response;
};

export const makePatchRequest = async (apiLinkSuffix, content) => {
  let response;

  try {
    response = await fetch(`${apiURL}/api${apiLinkSuffix}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${currentAuthToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });
  } catch (e) {
    window.alert(
      "Serveriga ei õnnestunud ühendust saada.\n" +
        "Muudatused pole salvestatud."
    );
    return null;
  }

  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
};

export const makeDeleteRequest = async (apiLinkSuffix) => {
  let response;

  try {
    response = await fetch(`${apiURL}/api${apiLinkSuffix}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentAuthToken}`,
      },
    });
  } catch (e) {
    window.alert(
      "Serveriga ei õnnestunud ühendust saada.\n" +
        "Muudatused pole salvestatud."
    );
    return null;
  }

  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
};

export const makeGetRequest = async (apiLinkSuffix) => {
  const response = await fetch(`${apiURL}/api${apiLinkSuffix}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${currentAuthToken}`,
    },
  });
  if (!response.ok) {
    promptRequestError(response);
    return null;
  }
  return response;
};

export const fetchUpdates = async (apiLinkSuffix, controller, dispFunc) => {
  const dispatch = useDispatch();

  fetchEventSource(`${apiURL}/api${apiLinkSuffix}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentAuthToken}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    signal: controller.signal,
    onopen(res) {
      if (res.ok && res.status === 200) {
        console.log("Connection made ", res);
      } else {
        console.log("Client side error ", res);
      }
    },
    onmessage(msg) {
      console.log(msg.data);
      dispatch(dispFunc(1));
      // JSON.parse(msg.data);
    },
    onclose() {
      console.log("Connection closed by the server");
    },
    onerror(err) {
      console.log("Server error", err);
    },
  });
};
