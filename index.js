const { getPictureQuery, getQuery, getClient } = require('./dbHandler');

const express = require('express');
const app = express();

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Connection stable"
    })
});

app.get('/menu', (req, res) => {
    const client = getClient();
    client.connect();
    client.query(getQuery(), (error, result) => {
        if (result.rows) {
            res.status(200).json({
                ok: true,
                menu: result.rows,
            });
        }
        else {
            res.status(500).json({
                ok: false,
                error
            });
        }
        client.end();
    });
});

app.get('/menu/:id', (req, res) => {
    const client = getClient();
    client.connect();
    client.query(getQuery(req.params.id), (error, result) => {
        if (!error){
            if (result.rows.length > 0){
                res.status(200).json({
                    ok: true,
                    item: result.rows[0],
                });
            }
            else {
                res.status(404).json({
                    ok: false,
                    error: "No elements with given id"
                });
            }
        } else {
            res.status(500).json({
                ok: false,
                error
            })
        }
        client.end();
    });
});

app.get('/menu/:id/picture', (req, res) => {
    const client = getClient();
    client.connect();
    client.query(getPictureQuery(req.params.id), (error, result) => {
        if (!error) {
            if (result.rows.length > 0) {
                const picture = result.rows[0].picture;
                if (picture) {
                    res.setHeader('ContentType', 'image/jpeg');
                    res.setHeader('X-Content-Type-Options', 'nosniff');
                }
                res.status(200).json({
                    ok: true,
                    picture
                });
            }
            else {
                res.status(404).json({
                    ok: false,
                    error: "No elements with given id"
                });
            }
        } else {
            res.status(500).json({
                ok: false,
                error
            });
        }
        client.end();
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server status: \x1b[32m%s\x1b[0m', 'online');
}); // specifies port to listen in and function to display a message when loaded