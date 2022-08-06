# Social Media Platform

## Stack/Tech used

- Express JS
- EJS (Templating Language)
- MongoDB
- JWT for Authentication
- Cookies
- Kue
- Morgan
- NodeMailer
- Socket IO

## Features

- Post Creation, Deletion, Updating
- Google Sign in

## Plans

- Move to Next JS for Front-end
- Update interface designs

### Setup

Create a `.env` file with the following code and replace your values.

```
SERVER_PORT=8000
DATABASE_NAME="socialpro_db_dev"
DATABASE_IP="127.0.0.1"
DATABASE_PORT=27017
SERVER_SESSION_KEY="session_key"
GOOGLE_USERNAME="youremail@domain.com"
GOOGLE_PASS="google_auth_key"
GOOGLE_CLIENT_ID="client_id"
GOOGLE_HEX="google_hex"
GOOGLE_CLIENT_SECRET="google_client_secret"
JWT_SECRET="jwt_secret"
```

1. Install pnpm using `npm i -g pnpm`
2. Install the dependancies using `pnpm install`
3. Run the server - `pnpm run dev_start`
