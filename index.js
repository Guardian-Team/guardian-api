const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');

const PORT = 8080;
const app = express();
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => console.log(`Server run on Port ${PORT}`));
