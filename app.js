const express = require('express')
const cookieParser = require('cookie-parser')
const AsyncLock = require('async-lock')
const path = require('path')
const bodyParser = require('body-parser')
const cheerio = require('cheerio')
// const $ = cheerio.load()
const fs = require('fs')

const db = require('./model/Database')
const api = require('./model/Api')

const app = express()

app.use(cookieParser())
app.use(express.static('view'))
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    db.getLatestId()
        .then(id => {
            if (!req.cookies['id']) {
                res.cookie('id', id + 1)
                res.sendFile('./view/index.html')
                return db.createUser(id+1)
            }
            res.sendFile(path.join(__dirname + '/view/index.html'))
        })
        .catch(err => {
            console.log(err.message)
        })
})

app.get('/weather/coordinates', ((req, res) => {
    if(req.query.lon && req.query.lat) {
        api.getCurrentWeather(null, req.query.lon, req.query.lat)
            .then(data => {
                res.status(data.status)
                res.json(data.json)
            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    } else {
        res.status(404)
    }
}))

app.get('/weather/city', (req, res) => {
    // console.log(req.query.q)
    api.getCurrentWeather(req.query.q)
        .then(data => {
            // const weather = data.weather
            // const main = data.main
            // console.log(data.status)
            res.status(data.status)
            res.json(data.json)

        })
        .catch(err => {
            console.log(err.message)
        })
})

app.get('/favourites/cities', (req, res) => {
    if(req.query.userId) {
        db.getUserCities(req.query.userId)
            .then(rows => {
                let cities = []
                rows.forEach(i => {
                    cities.push(i.city_name)
                })
                res.status(200)
                res.json({
                    cities: cities
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    } else {
        res.status(404)
    }
})

app.post('/favourites', (req, res) => {
    // console.log(req.body)
    db.addCity(req.body.userId, req.body.city)
        .catch(err => {
            console.log(err.message)
        })
})

app.delete('/favourites', (req, res) => {
    // console.log(req.body)
    db.removeCity(req.body.userId, req.body.city)
        .catch(err => {
            console.log(err.message)
        })
})

app.listen(8888)