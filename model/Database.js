const mysql = require('mysql')
const Exception = require('../exception/exception')

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.db,
    user: process.env.user,
    password: process.env.password
});

class Database {
    static getLatestId() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let query = 'select * from users'

                connection.query(query, (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    // if(!rows.length)
                    //     return reject(new Exception(4, "User doesn\'t exist", username))

                    return resolve(rows[rows.length-1].id);

                })
            })
        })

    }

    static createUser(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let query = 'insert into users (id) values (?)'

                connection.query(query, [id], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    // if(!rows.length)
                    //     return reject(new Exception(4, "User doesn\'t exist", username))

                    return resolve(rows);

                })
            })
        })
    }

    static getUserCities(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let query = 'select * from user_city where user_id = ?'

                connection.query(query, [id], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    // if(!rows.length)
                    //     return reject(new Exception(4, "User doesn\'t exist", username))

                    return resolve(rows);

                })
            })
        })
    }

    static addCity(userId, city) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let query = 'insert into user_city (user_id, city_name) values (?, ?)'

                connection.query(query, [userId, city, userId], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve(rows);

                })
            })
        })
    }

    static removeCity(userId, city) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err){
                    connection && pool._freeConnections.indexOf(connection) === -1 && connection.release()
                    return reject(new Exception(1, err.message))
                }
                let query = 'delete from user_city where user_id = ? and city_name = ?'

                connection.query(query, [userId, city], (err, rows) => {
                    pool._freeConnections.indexOf(connection) === -1 && connection.release()

                    if(err){
                        return reject(new Exception(2, err.message))
                    }

                    return resolve(rows);

                })
            })
        })
    }
}

module.exports = Database