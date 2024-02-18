const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function write(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataPath, JSON.stringify(contenido, null, '\t'), 'utf8', (error) => {
            if (error) reject(new Error('Error. No se pudo escribir'));

            resolve(true);
        });
    });
}

function read() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataPath, 'utf8', (error, result) => {
            if (error) reject(new Error('Error. No se pudo leer'));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(productos) {
    let mayorId = 0;

    productos.forEach((producto) => {
        if (Number(producto.id) > mayorId) {
            mayorId = Number(producto.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error('Error. El Id está indefinido.');

    const productos = await read();
    const producto = productos.find((element) => element.id === id);

    if (!producto) throw new Error('Error. El Id no corresponde a un producto en existencia.');

    return producto;
}

async function findAll() {
    const productos = await read();
    return productos;
}

async function create(producto) {
    if (!producto?.name || !producto?.isPromotion) throw new Error('Error. Datos incompletos.');

    let productos = await read();
    const productoConId = { id: generarId(productos), ...producto };

    productos.push(productoConId);
    await write(productos);

    return productoConId;
}

async function update(producto) {
    if (!producto?.id || !producto?.name || !producto?.isPromotion) throw new Error('Error. Datos incompletos.');

    let productos = await read();
    const index = productos.findIndex((element) => element.id === producto.id);

    if (index < 0) throw new Error('Error. El Id no corresponde a un producto en existencia.');

    productos[index] = producto;
    await write(productos);

    return productos[index];
}

async function destroy(id) {
    if (!id) throw new Error('Error. El Id está indefinido.');

    let productos = await read();
    const index = productos.findIndex((element) => element.id === id);

    if (index < 0) throw new Error('Error. El Id no corresponde a un producto en existencia.');

    const producto = productos[index];
    productos.splice(index, 1);
    await write(productos);

    return producto;
}

module.exports = { findOneById, findAll, create, update, destroy };