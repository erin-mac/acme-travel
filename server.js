const express = require('express')
const app = express()
const Sequelize = require('sequelize');
const { syncAndSeed } = require('./db')
const { db, User, Hotel, Stay } = require('./db')



app.get('/', (req, res, next) => {
    User.findAll({
        include: [{
            model: Stay,
            include: [
                Hotel
            ]
        }]
    })
        //.then(names => { names.map(name => { res.send(name) }) })
        .then(names => {
            res.send(`<html>
        <head>
        <div class='container'>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        </head>
        <body><h2>Acme Hotels</h2>
            ${names.map(eachName => {
                return `${eachName.name}
        ${eachName.stays.map(stay => { return `<li>${stay.hotel.hotel} (${stay.days} days) </li>` }).join("")}`
            }).join("")}
        </div >
        </body >
        </html >`
            )
        })
})

syncAndSeed();
app.listen(3000, () => console.log('listening on port 3000'))