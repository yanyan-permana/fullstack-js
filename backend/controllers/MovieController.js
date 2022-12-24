import Movie from "../models/MovieModel.js";
import path from "path";
import fs from "fs";
import { validationResult } from "express-validator";

// Get All Movie
const getAllMovie = async (req, res) => {
    try {
        const response = await Movie.findAll();
        res.json({
            status: "success",
            message: "Get All Movie",
            data: response
        });
    } catch (err) {
        console.log(err.message);
    }
};

// Get Movie By Id
const getMovieById = async (req, res) => {
    try {
        const response = await Movie.findOne({
            where: {
                id: req.params.id
            }
        });
        // Cek jika data tidak ditemukan
        if (response === null) {
            res.status(404)
                .json({
                    status: "error",
                    message: "No Data Found"
                });
        } else {
            res.json({
                status: "success",
                message: "Get Movie By Id",
                data: response
            });
        }
    } catch (err) {
        console.log(err.message);
    }
};

// Create Movie
const saveMovie = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validasi jika file poster tidak dikirm
        if (req.files === null) {
            const newErrors = errors.array();
            newErrors.push({
                "msg": "Poster is required",
                "param": "poster",
                "location": "body"
            });
            return res.status(422)
                .json({
                    status: "error",
                    data: newErrors
                });
        } else {
            return res.status(422)
                .json({
                    status: "error",
                    data: errors.array()
                });
        }
    } else {
        if (req.files === null) {
            return res.status(422)
                .json({
                    status: "error",
                    data: {
                        "msg": "Poster is required",
                        "param": "poster",
                        "location": "body"
                    }
                });
        } else {
            const title = req.body.title;
            const year = req.body.year;
            const released = req.body.released;
            const runtime = req.body.runtime;
            const genre = req.body.genre;
            const director = req.body.director;
            const writer = req.body.writer;
            const actors = req.body.actor;
            const plot = req.body.plot;
            const language = req.body.language;
            const country = req.body.country;
            const poster = req.files.poster; // Get file poster
            const posterSize = poster.data.length; // Get size poster
            const posterExtension = path.extname(poster.name); // Get extension poster
            const posterName = Date.now().toString() + posterExtension; // Set name poster
            const allowedType = [".png", ".jpg", ".jpeg"]; // Type yang diizinkan
            const rating = req.body.rating;

            // Validasi type file poster
            if (!allowedType.includes(posterExtension.toLocaleLowerCase())) {
                return res.status(422)
                    .json({
                        status: "error",
                        message: "The poster allowed types are only jpg, jpeg, png"
                    });
            }

            // Validasi jika size file poster lebih dari 5MB
            if (posterSize > 5000000) {
                return res.status(422)
                    .json({
                        status: "error",
                        message: "Image must be less than 5 MB"
                    });
            }

            poster.mv(`./public/assets/images/${posterName}`, async (err) => {
                if (err) {
                    return res.status(500)
                        .json({
                            status: "error",
                            message: err.message
                        });
                }

                try {
                    const data = await Movie.create({
                        title,
                        year,
                        released,
                        runtime,
                        genre,
                        director,
                        writer,
                        actors,
                        plot,
                        language,
                        country,
                        poster: posterName,
                        rating,
                    });
                    return res.status(201)
                        .json({
                            status: "success",
                            message: "Movie Created Successfuly",
                            data
                        });
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    }
};

// Update Movie
const updateMovie = async (req, res) => {
    const movie = await Movie.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!movie) {
        return res.status(404)
            .json({
                status: "error",
                message: "No Data Found"
            });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({
                status: "error",
                data: errors.array()
            });
    } else {
        let posterName = "";
        if (req.files === null) {
            posterName = movie.poster
        } else {
            const poster = req.files.poster;
            const posterSize = poster.data.length;
            const posterExtension = path.extname(poster.name); // Get extension poster
            posterName = Date.now().toString() + posterExtension; // Set name poster
            const allowedType = [".png", ".jpg", ".jpeg"]; // Type yang diizinkan            

            // Validasi type file poster
            if (!allowedType.includes(posterExtension.toLocaleLowerCase())) {
                return res.status(422)
                    .json({
                        status: "error",
                        message: "The poster allowed types are only jpg, jpeg, png"
                    });
            }

            // Validasi jika size file poster lebih dari 5MB
            if (posterSize > 5000000) {
                return res.status(422)
                    .json({
                        status: "error",
                        message: "Image must be less than 5 MB"
                    });
            }

            // Delete file poster
            const filePath = `./public/assets/images/${movie.poster}`;
            fs.unlinkSync(filePath);
            poster.mv(`./public/assets/images/${posterName}`, async (err) => {
                if (err) {
                    return res.status(500)
                        .json({
                            status: "error",
                            message: err.message
                        });
                }
            });
        }

        const title = req.body.title;
        const year = req.body.year;
        const released = req.body.released;
        const runtime = req.body.runtime;
        const genre = req.body.genre;
        const director = req.body.director;
        const writer = req.body.writer;
        const actors = req.body.actor;
        const plot = req.body.plot;
        const language = req.body.language;
        const country = req.body.country;
        const rating = req.body.rating;

        try {
            await Movie.update({
                title,
                year,
                released,
                runtime,
                genre,
                director,
                writer,
                actors,
                plot,
                language,
                country,
                poster: posterName,
                rating,
            }, {
                where: {
                    id: req.params.id
                }
            });

            const movie = await Movie.findOne({
                where: {
                    id: req.params.id
                }
            });
            return res.status(201)
                .json({
                    status: "success",
                    message: "Movie Updated Successfuly",
                    data: movie
                });
        } catch (err) {
            console.log(err.message);
        }
    }
};

// Delete Movie
const deleteMovie = async (req, res) => {
    const movie = await Movie.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!movie) {
        return res.status(404)
            .json({
                status: "error",
                message: "No Data Found"
            });
    }

    try {
        // Delete file poster
        const filePath = `./public/assets/images/${movie.poster}`;
        fs.unlinkSync(filePath);
        await Movie.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(200)
            .json({
                status: "success",
                message: "Movie Deleted Successfuly"
            });
    } catch (err) {
        console.log(err.message);
    }
};

export {
    getAllMovie,
    getMovieById,
    saveMovie,
    deleteMovie,
    updateMovie
};