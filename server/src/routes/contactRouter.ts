import { Router } from "express";
import { postContact } from "../controller/contactController";

const router = Router();

router.post("/contact", postContact);

export default router;
