const fetch = require('node-fetch')
const headers = {
  // 'Access-Control-Allow-Origin': process.env.VITE_HOST,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST',
}

exports.handler = async function () {
  var key = process.env.RCM_KEY
  var secret = process.env.RCM_SECRET

  var myHeaders = new fetch.Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

  var urlencoded = new URLSearchParams()
  urlencoded.append('username', key)
  urlencoded.append('password', secret)
  urlencoded.append('grant_type', 'password')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  }

  const res = await fetch(
    'https://api.rentalcarmanager.com/v32/token',
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log('error', error))

  return {
    statusCode: 200,
    headers,
    body: res,
  }
}
