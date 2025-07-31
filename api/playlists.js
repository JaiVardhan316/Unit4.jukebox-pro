import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import { getPlaylistById } from "#db/queries/playlists";

router
  .route("/")
  .get(requireUser, async (req, res) => {
    const playlists = await getPlaylists();
    res.send(playlists);
  })
  .post(requireUser, async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.route("/:id").get(requireUser, async (req, res) => {
  const { id } = req.params;
  const playlist = await getPlaylistById(id);
  if (playlist.user_id !== req.user.id)
    return res.status(403).send("you don't own this playlist");
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(requireUser, async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    const {id} = req.params;
    const playlist = await getPlaylistById(id);
    if (playlist.id !== req.user.id) return res.status(403).send("invalid");
    res.send(tracks);
  })
  .post(requireUser, async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const {id} = req.params;
    const playlist = await getPlaylistById(id);
    if (playlist.user_id !== req.user.id) return res.status(403).send("issue");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");


    const playlistTrack = await createPlaylistTrack(playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
