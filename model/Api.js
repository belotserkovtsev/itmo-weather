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
            curl.setOpt(Curl.option.HTTPHEADER, ['x-rapidapi-key: d5d8135a54mshd320d2f046aa089p1025c7jsnbd7c07d68604'])

            curl.on('end', function (statusCode, data, headers) {
                // console.info(statusCode);
                // console.info('---');
                // console.info(JSON.parse(data));
                // console.info('---');
                // console.info(this.getInfo( 'TOTAL_TIME'));
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