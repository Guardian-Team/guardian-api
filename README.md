# Guardian API
## API List
### Auth
- Register
- Login

### User
- Get User by Id
- Update User

### Contact
- Get Contacts
- Add Contact
- Update Contact
- Delete Contact

## How to running in local
- Download your cloud storage credentials and place it in this project folder
- In file /controllers/user.js, replace this code
```sh
const storage = new Storage({
  keyFilename: process.env.keyFilename,
  projectId: process.env.PROJECT_ID,
});
```
to
```sh
const storage = new Storage({
  keyFilename: path.join(__dirname, '<your-path-location-of-credentials>'),
  projectId: process.env.PROJECT_ID,
});
```
- Install dependencies and export environment variables
```sh
npm install
export DB_HOST=<enter-your-database-host> DB_USER=<enter-your-database-user> DB_PASSWORD=<enter-your-database-user-password> DB_NAME=<enter-your-database-name> JWT_PASS=<enter-your-jwt-secret-or-private key> PROJECT_ID=<enter-your-gcp-project-id> BUCKET_NAME=<enter-your-cloud-storage-bucket-name>
```
- Running migrations of database
```sh
npx sequelize-cli db:migrate
```
- Running application
```sh
nodemon index
```
