import { Router } from "express";
import { postContact ,getContacts,sendMsg} from "../controller/contactController";

const router = Router();

router.post("/contact", postContact);
router.get('/usercontacts',getContacts);
router.post('/resend',sendMsg)

export default router;
