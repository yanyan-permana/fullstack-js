import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import MovieRoute from "./routes/MovieRoute.js";

const app = express();

process.env.TZ = 'Asia/Jakarta'

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// Route
app.use(MovieRoute);

app.listen(3030, () => {
    console.log("Server running at port 3030");
});