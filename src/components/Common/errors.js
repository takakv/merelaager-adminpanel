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
