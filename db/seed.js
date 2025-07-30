import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";
import { createToken } from "#utils/jwt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const testUser = await createUser();
  const token = createToken({
    id: testUser.id
  })
  console.log(createUser());
  console.log(token);
  // for (let i = 1; i <= 2; i++) {
  //   await createUser("User " + i, "abc" + i);
  // }

  for (let i = 1; i <= 20; i++) {
    // const userId = Math.floor(Math.random() * 2) + 1;
    await createPlaylist("Playlist " + i, "lorem ipsum playlist description", testUser.id);
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}
