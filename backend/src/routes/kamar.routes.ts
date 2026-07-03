import { Router } from "express";
import * as kamarController from "../controllers/kamar.controller";

const router = Router();

router.get("/", kamarController.getKamar);
router.post("/", kamarController.createKamar);
router.put("/:id", kamarController.updateKamar);
router.delete("/:id", kamarController.deleteKamar);

export default router;
