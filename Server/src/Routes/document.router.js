import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  uploadDocuments,
  getAllDocuments,
  getDocument
} from "../Controllers/document.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/upload-document", uploadDocuments);

router.get("/get-all-documents", getAllDocuments);

router.get("/get-document/:id", getDocument);

export default router; 