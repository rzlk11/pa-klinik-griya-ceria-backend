import express from "express";
import {
  getVaksin,
  getVaksinById,
  createVaksin,
  updateVaksin,
  deleteVaksin,
} from "../controllers/Vaksin.js";

const router = express.Router();

router.get("/vaksin", getVaksin);
router.get("/vaksin/:id", getVaksinById);
router.post("/vaksin", createVaksin);
router.patch("/vaksin/:id", updateVaksin);
router.delete("/vaksin/:id", deleteVaksin);

export default router;
