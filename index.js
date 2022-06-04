const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');

const PORT = 8080;
const app = express();

app.use('/image', express.static('images'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => console.log(`Server run on Port ${PORT}`));
