import express from "express";
import {
  getTerapis,
  getTerapisById,
  createTerapis,
  updateTerapis,
  deleteTerapis
} from "../controllers/Terapis.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/terapis", verifyUser, getTerapis);
router.get("/terapis/:id", verifyUser, getTerapisById);
router.post("/terapis", verifyUser, createTerapis);
router.patch("/terapis/:id", verifyUser, updateTerapis);
router.delete("/terapis/:id", verifyUser, deleteTerapis);

export default router;
