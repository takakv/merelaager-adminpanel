import { makeGetRequest } from "./requestAPI";

export default async () => {
  const res = await makeGetRequest("su/info");
  if (!res.ok) {
    console.log("Something went bad");
    return null;
  }

  return res.json();
};
