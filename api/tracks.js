import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById, } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import { getPlaylistFromTracks } from "#db/queries/playlists";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.route("/:id/playlists").get(requireUser, async (req, res) => {
  const {id} = req.params;
  const track = await getTrackById(id);
  if (!track) return res.status(404).send("issue");
  const playlists = await getPlaylistFromTracks(track.id, req.user.id)
  res.send(playlists);
})

