import { Router } from "express";
import { postContact ,getContacts,sendMsg,statusUpdate} from "../controller/contactController";

const router = Router();

router.post("/contact", postContact);
router.get('/usercontacts',getContacts);
router.post('/resend',sendMsg)
router.post('/statusupdate',statusUpdate)

export default router;
