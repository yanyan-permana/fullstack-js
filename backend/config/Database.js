import { Sequelize } from "sequelize";

// Setting database mysql
const db = new Sequelize("fullstack_js", "root", "", {
    host: "localhost",
    dialect: "mysql",
    timezone: "+07:00" // Time asia / jakarta
});

export default db;