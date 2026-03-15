const express = require("express");
const { getRoom, serializeRoom } = require("../store/roomStore");

const router = express.Router();

router.get("/:roomId/state", (req, res) => {
  const room = getRoom(req.params.roomId);
  res.json(serializeRoom(room));
});

module.exports = router;