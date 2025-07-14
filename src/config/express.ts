import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { application } from "../constants/application";
import { router as indexRoute } from "../routes/index";
import { errorHandler, notFoundErrorHandler } from "../middlewares/apiErrorHandler";
import { apiResponseHandler } from '../middlewares/apiResponseHandler.middleware';
import path from 'path';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options('*', cors());

// request logger
app.use(morgan("dev"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiResponseHandler);

app.use('/uploads', express.static(path.join(__dirname, '../../uploads'))); // Adjust the path accordingly


// Router
app.use(application.url.base, indexRoute);

// Error Handler
app.use(notFoundErrorHandler);
app.use(errorHandler);

export { app };