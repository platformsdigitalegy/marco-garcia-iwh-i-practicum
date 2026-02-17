require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


const PRIVATE_APP_ACCESS = process.env.HS_ACCESS_TOKEN;
const OBJECT_TYPE = '2-57754819';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};


app.get('/', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,breed,age`;
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot', data });
    } catch (error) {
        console.error(error);
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});


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