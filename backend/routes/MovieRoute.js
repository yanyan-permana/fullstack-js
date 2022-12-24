import express from "express";
import { 
    getAllMovie, 
    getMovieById, 
    saveMovie,
    deleteMovie,
    updateMovie
} from "../controllers/MovieController.js";
import { check } from "express-validator";

const router = express.Router();
router.get("/movies", getAllMovie);
router.get("/movies/:id", getMovieById);
router.post(
    "/movies", 
    [
        check('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        check('year')
            .not()
            .isEmpty()
            .withMessage('Year is required')
    ],
    saveMovie
);
router.delete("/movies/:id", deleteMovie);
router.patch(
    "/movies/:id", 
    [
        check('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        check('year')
            .not()
            .isEmpty()
            .withMessage('Year is required')
    ],
    updateMovie
);

export default router;