import * as express from "express";
import authRoute from "./auth.routes";

const router = express.Router();
router.use('/', authRoute)

export { router };
