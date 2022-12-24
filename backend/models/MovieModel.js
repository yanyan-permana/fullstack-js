import { DataTypes } from "sequelize";
import db from "../config/Database.js";

// Definisi table movie
const Movie = db.define("movies", {
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    released: DataTypes.DATEONLY,
    runtime: DataTypes.STRING,
    genre: DataTypes.STRING,
    director: DataTypes.STRING,
    writer: DataTypes.STRING,
    actors: DataTypes.STRING,
    plot: DataTypes.STRING,
    language: DataTypes.STRING,
    country: DataTypes.STRING,
    poster: DataTypes.STRING,
    rating: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default Movie;

// Run module db
(async () => {
    await db.sync();
})();