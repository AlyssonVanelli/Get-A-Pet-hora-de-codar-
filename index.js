const express = require('express');
const cors = require('cors');
const { plugin } = require('mongoose');
require('dotenv').config()
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: 'https://localhost:3000' }));

app.use(express.static('public'))

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(process.env.PORT || 5000)