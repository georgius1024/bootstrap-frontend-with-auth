let production = {
  NODE_ENV: 'production',
  DEBUG_MODE: false,
  APP_NAME: 'Bootstrap frontend app',
  APP_ID: 'bootstrap',
  API_URL: '/api/'
}

let development = Object.assign({}, production, {
  NODE_ENV: 'development',
  API_URL: 'http://localhost:3333/api/v1/',
  DEBUG_MODE: true
})

let config = {
  development,
  production
}

let env = process.env.NODE_ENV || 'development'
export default config[env]
