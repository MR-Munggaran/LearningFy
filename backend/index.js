import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/database.js";
import  authRoutes  from "./routes/auth.route.js";
import  categoryRoutes  from "./routes/category.route.js";
import  courseRoutes  from "./routes/course.route.js";
import  moduleRoutes  from "./routes/modules.route.js";
import  lessonRoutes  from "./routes/lesson.route.js";
import  enrollmentRoutes  from "./routes/enrollement.route.js";
import  paymentRoutes  from "./routes/payment.route.js";
import  progressRoutes  from "./routes/progress.route.js";
import  reviewRoutes  from "./routes/review.route.js";

const app = express();
const PORT = ENV_VARS.PORT;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("utils/upload/images"));
app.use("/uploads/docs", express.static("utils/upload/docs"));

app.get('/', (req,res) => res.send ("Server is Ready"));
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/module', moduleRoutes)
app.use('/api/v1/lesson', lessonRoutes)
app.use('/api/v1/enrollment', enrollmentRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/progress', progressRoutes)
app.use('/api/v1/review', reviewRoutes)

// pass instructor dummy123


app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  connectDB();
});