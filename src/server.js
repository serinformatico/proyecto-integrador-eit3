const express = require("express");
const cors = require("cors");
const multer = require("multer");

const productsRouter = require("./routes/products.router.js");
const shoppingCartsRouter = require("./routes/shoppingCarts.router.js");
const consultsRouter = require("./routes/consults.router.js");
const paymentsRouter = require("./routes/payments.router.js");

const database = require("./connectionDB.js");

const { ERROR_SERVER } = require("./constants/messages.js");
const { ENV_PATH, DIR_PUBLIC_PATH, DIR_VIEWS_PATH } = require("./constants/paths.js");

// Configuración de la ruta de las variables de entorno
require("dotenv").config({ path: ENV_PATH });

// Configuración de express
const server = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Configuración de CORS
server.use(cors({
    origin: process.env.FRONTEND_HOST,
    methods: "GET,PUT,PATCH,POST,DELETE",
}));

// Configuración del motor de plantillas HTML
server.set("views", DIR_VIEWS_PATH);
server.set("view engine", "ejs");

// Configuración de ruta estática
server.use("/public", express.static(DIR_PUBLIC_PATH));

// Middlewares & Routes
server.use(express.json());
server.use("/api/products", productsRouter);
server.use("/api/shopping-carts", shoppingCartsRouter);
server.use("/api/consults", consultsRouter);
server.use("/api/payments", paymentsRouter);

// Control de errores
server.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(error.code).send({ success: false, message: error.field });
    }

    res.status(500).send({ success: false, message: ERROR_SERVER });
});

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Método oyente de solicitudes
server.listen(PORT, HOST, () => {
    console.log(`Server NodeJS version: ${process.version}`);
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
    database.connect(process.env.DATABASE_URL, process.env.DATABASE_NAME);
});

// Método que controla el cierre del servidor
process.on("SIGINT", async () => {
    await database.desconnect();
    process.exit();
});