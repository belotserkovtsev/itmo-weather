const { Curl } = require('node-libcurl');

class Api {
    static getCurrentWeather(city, lon, lat) {
        return new Promise((resolve, reject) => {
            const curl = new Curl();

            if(city)
                curl.setOpt('URL', `https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`)
            else if(lon && lat)
                curl.setOpt('URL', `https://community-open-weather-map.p.rapidapi.com/weather?lon=${lon}&lat=${lat}&units=metric`)
            else
                return resolve({
                    json: null,
                    status: 500
                })

            curl.setOpt('FOLLOWLOCATION', true);
            curl.setOpt(Curl.option.HTTPHEADER, ['x-rapidapi-key: 62c6a7b44cmshd35b7189c4cc428p199b4ejsn70c836a18c59'])

            curl.on('end', function (statusCode, data, headers) {
                resolve({
                    json: JSON.parse(data),
                    status: statusCode
                })
                this.close();
            });

            curl.on('error', () => {
                curl.close.bind(curl)
                reject()
            });
            curl.perform();
        })
    }
}


module.exports = Api