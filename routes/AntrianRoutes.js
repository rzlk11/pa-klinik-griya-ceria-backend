import express from "express";
import {
  getAntrian,
  getAntrianById,
  createAntrian,
  updateAntrian,
  deleteAntrian
} from "../controllers/Antrian.js";

const router = express.Router();

router.get('/antrian', getAntrian);
router.get('/antrian/:id', getAntrianById);
router.post('/antrian', createAntrian);
router.patch('/antrian/:id', updateAntrian);
router.delete('/antrian/:id', deleteAntrian);

export default router;
