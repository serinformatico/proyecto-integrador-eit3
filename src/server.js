const express = require('express');
const { findOneById, findAll, create, update, destroy } = require('./database/data.manager.js');
const path = require('path');

const server = express();
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/public', express.static(path.join(__dirname, 'public')));

// Obtener todos los productos: GET http://127.0.0.1:3030/productos
server.get('/productos', (req, res) => {
    findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un producto específico: GET http://127.0.0.1:3030/productos/1
server.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo producto: POST http://127.0.0.1:3030/productos
server.post('/productos', (req, res) => {
    const { name, description, image, sizes, isPromotion } = req.body;

    create({ name, description, image, sizes, isPromotion })
        .then((productos) => res.status(201).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un producto específico: PUT http://127.0.0.1:3030/productos/1
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, image, sizes, isPromotion } = req.body;

    update({ id: Number(id), name, description, image, sizes, isPromotion })
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un producto específico: DELETE http://127.0.0.1:3030/productos/1
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});