const fs = require("fs");
const path = require("path");
const { getToken, getAll, getDateString, get } = require("./utils");

const csvHeaders = ["artists", "name", "album"];

async function getPlaylists() {
  // Get auth token
  const tokenRes = await getToken();
  if (!tokenRes) return;

  // Get all playlists for this user
  const user_id = process.env.USER_ID;
  const playlists = await getAll(
    tokenRes.access_token,
    `https://api.spotify.com/v1/users/${user_id}/playlists`
  );

  // Go through each playlist
  const dateString = getDateString();
  for (let i = 0; i < playlists.length; i++) {
    const playlist = playlists[i];
    const tracks = await getAll(tokenRes.access_token, playlist.tracks.href);

    const csvData = [
      csvHeaders,
      ...tracks.map((t) => [
        t.track.artists.map((a) => a.name).join(", "),
        t.track.name,
        t.track.album.name,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const dirSrc = path.join(__dirname, "data/playlists", dateString);
    const csvSrc = path.join(dirSrc, `${playlist.name}.csv`);

    // Write file
    fs.mkdirSync(dirSrc, { recursive: true });
    fs.writeFileSync(csvSrc, csvData);
  }
}

getPlaylists();
