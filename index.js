require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// CONFIGURACIÓN: Cambia estos valores
const PRIVATE_APP_ACCESS = process.env.HS_ACCESS_TOKEN;
const OBJECT_TYPE = '2-57754819'; // El nombre interno de tu objeto (ej: 'pets' o '2-123456')

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// 1. RUTA PARA LA HOMEPAGE (Muestra la tabla)
app.get('/', async (req, res) => {
    // IMPORTANTE: Cambia 'name,breed,age' por los nombres internos de tus 3 propiedades
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,breed,age`;
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot', data });
    } catch (error) {
        console.error(error);
    }
});

// 2. RUTA PARA EL FORMULARIO (Muestra la página de creación)
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// 3. RUTA PARA ENVIAR LOS DATOS (Procesa el formulario)
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
    const newRecord = {
        properties: {
            "name": req.body.name,
            "breed": req.body.breed, 
            "age": req.body.age 
        }
    };
    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));