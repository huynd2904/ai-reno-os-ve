## 📘 Description

**AiRenoOS Engine** is a server-side application built using the [NestJS](https://nestjs.com/) framework.  
It provides core backend functionalities for the AiRenoOS platform, including:

- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Role-based User Management
- ✅ PostgreSQL integration via TypeORM
- ✅ Realtime communication using Socket.IO (secured with JWT)
- ✅ Swagger API documentation
- ✅ CORS configuration for multiple origins

---

## ⚙️ Environment Configuration

All environment variables are defined in the `.env` file at the project root.

```bash
# Application
PORT=5000
JWT_SECRET=<secret-key>
JWT_ISSUER=http://localhost:5000
JWT_AUDIENCE=http://localhost:5000
JWT_EXPIRES_IN=500 # minutes
REFRESH_EXPIRES_IN=7 # days
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000,https://app.airenow.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Admin123@
DB_NAME=airenoos

## Project setup

```bash
$ npm install
```
## Migration

```bash
# generate migrations
$ npm run migration:generate ./src/migrations/<migration-name>

# run migrations
$ npm run migration:run

# revert last migration
$ npm run migration:revert
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
