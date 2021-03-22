export const makePostRequest = async (apiLinkSuffix) => {
  const credentials = localStorage.getItem("credentials");
  const accessToken = JSON.parse(credentials).accessToken;

  const response = await fetch("http://localhost:3000/api/" + apiLinkSuffix, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (!response.ok) promptRequestError(response);
  return response.ok;
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
