require("dotenv").config();

/**
 * Get access token from spotify API
 */
async function getToken() {
  if (!process.env.CLIENT_SECRET) {
    console.error("Missing client secret");
    return;
  }
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64"),
    },
  });
  return await response.json();
}

/**
 * Get request for spotify API
 */
async function get(access_token, url) {
  console.log(access_token, url);
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  });
  return await response.json();
}

/**
 * Get all items from a paginated list from the spotify API
 */
async function getAll(access_token, url) {
  let nextUrl = url;
  const items = [];
  while (!!nextUrl) {
    const json = await get(access_token, nextUrl);
    nextUrl = json.next;
    items.push(...json.items);
  }
  return items;
}

/**
 * Generate a date string for use in folders
 */
function getDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

module.exports = {
  getToken,
  get,
  getAll,
  getDateString,
};
