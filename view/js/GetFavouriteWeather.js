// let userCities =
citiesForId(getCookie('id'))
    .then(cities => {
        for(let i = 0; i < cities.length; ++i) {
            // console.log(localStorage.getItem(i))
            setTimeout( () => {
                // console.log(cities[i])
                requestFor(cities[i], false)
            }, 2000 * i)
        }
    })

let requestHistory = []

document.getElementById("submitCity").addEventListener("click", () => {
  let city = document.getElementById('inputCity').value.toLowerCase()
  document.getElementById('inputCity').value = ""
  if(city.trim().length > 0 && !requestHistory.includes(city)) {
      requestHistory.push(city)
      citiesForId(getCookie('id'))
          .then(cities => {
              if(!cities.includes(city))
                  requestFor(city, true)
          })
          .catch(err => {
              console.log(err.message)
          })

  }
})

function citiesForId(id) {
    return new Promise((resolve, reject) => {
        let citiesRequest = new XMLHttpRequest()
        citiesRequest.open('GET', `/favourites/cities?userId=${id}`, true)
        citiesRequest.onload = function () {
            let data = JSON.parse(this.response)
            resolve(citiesRequest.status === 200 ? data.cities : null)
        }
        citiesRequest.send()
    })
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function requestFor(city, doWrite = false) {
  let wrapperBlock = document.getElementById("weatherDataWrapper")

  let blockToAppend = document.querySelector('#weatherBlockLoadingTemplate')
  let clone = document.importNode(blockToAppend.content, true);
  clone.querySelector('#weatherBlockLoading').id = 'weatherBlockLoading'+city
  clone.querySelector('#weatherBlockLoaded').id = 'weatherBlockLoaded'+city
  wrapperBlock.appendChild(clone)

  let favouriteRequest = new XMLHttpRequest()
  favouriteRequest.open('GET', `/weather/city?q=${city}`, true)

  favouriteRequest.onreadystatechange = function() {
        if(favouriteRequest.readyState === XMLHttpRequest.DONE && favouriteRequest.status === 200) {
            let data = JSON.parse(this.response)
            let wbLoading = document.querySelector('#weatherBlockLoading'+city)
            let wbLoaded = document.querySelector('#weatherBlockLoaded'+city)
            wbLoading.style = "display: none;"
            wbLoaded.style = ""

            let p = wbLoaded.querySelectorAll("p")
            let h3 = wbLoaded.querySelectorAll("h3")

            h3[0].textContent = data.name
            p[0].textContent = data.main.temp + "°C"
            p[2].textContent = data.wind.speed + " km/h"
            p[4].textContent = data.visibility + " m"
            p[6].textContent = data.main.pressure + " bar"
            p[8].textContent = data.main.humidity + " %"
            p[10].textContent = data.coord.lon + ', ' + data.coord.lat

            // if(localStorage.getItem(city) === null) {
            //   localStorage.setItem(city, city);
            // }
            if(doWrite) {
                let postDataRequest = new XMLHttpRequest()
                postDataRequest.open('POST', '/favourites', true)
                postDataRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                postDataRequest.send(`userId=${getCookie('id')}&city=${city.toLowerCase()}`)
            }

            let remove = wbLoaded.querySelectorAll('button')
            remove[0].addEventListener("click", () => {
              wbLoaded.remove()
              wbLoading.remove()
              // localStorage.removeItem(city)
                let deleteDataRequest = new XMLHttpRequest()
                deleteDataRequest.open('DELETE', '/favourites', true)
                deleteDataRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                deleteDataRequest.send(`userId=${getCookie('id')}&city=${city.toLowerCase()}`)
            })

        } else if (favouriteRequest.status !== 200) {
          let wbLoading = document.querySelector('#weatherBlockLoading'+city)
          let p = wbLoading.querySelectorAll("p")
          let img = wbLoading.querySelectorAll("img")
          p[0].style = ""
          p[0].textContent = "Error " + favouriteRequest.status
          img[0].style = "display: none;"
        }
    }

    favouriteRequest.send()
}
