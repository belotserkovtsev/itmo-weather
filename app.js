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
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res, next) => {
    if (!req.cookies['id']) {
        db.getLatestId()
            .then(id => {
                console.log('setting new cookie')
                res.cookie('id', id + 1)
                next()
                return db.createUser(id+1)
            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    } else {
        next()
    }

})

app.use(express.static('view'))

app.get('/weather/coordinates', ((req, res) => {
    if(req.query.lon && req.query.lat)
        api.getCurrentWeather(null, req.query.lon, req.query.lat)
            .then(data => {
                res.status(data.status)
                res.json(data.json)
            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    else
        res.status(404)

}))

app.get('/weather/city', (req, res) => {
    // console.log(req.query.q)
    if(req.query.q)
        api.getCurrentWeather(req.query.q)
            .then(data => {
                // const weather = data.weather
                // const main = data.main
                // console.log(data.status)
                res.status(data.status)
                res.json(data.json)

            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    else
        res.status(404)
})

app.get('/favourites/cities', (req, res) => {
    if(req.query.userId)
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
                res.status(200)
                console.log(err.message)
            })
    else
        res.status(404)
})

app.post('/favourites', (req, res) => {
    // console.log(req.body)
    if(req.body.userId && req.body.city)
        db.addCity(req.body.userId, req.body.city)
            .then(_ => {
                res.status(200)
            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    else
        res.status(404)
})

app.delete('/favourites', (req, res) => {
    // console.log(req.body)
    if(req.body.userId && req.body.city)
        db.removeCity(req.body.userId, req.body.city)
            .then(_ => {
                res.status(200)
            })
            .catch(err => {
                res.status(500)
                console.log(err.message)
            })
    else
        res.status(404)
})

app.listen(8888)