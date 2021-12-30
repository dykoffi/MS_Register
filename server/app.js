"use strict"

const express = require('express');
const { cwd } = require('process');
const helmet = require('helmet');
const morgan = require('morgan');
const { join } = require('path');
const cors = require('cors');

const cookieparser = require('cookie-parser');
const saveLog = require('../middlewares/saveLog');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(cwd(), 'public')));
app.use(express.json());
app.use(cookieparser());
app.use(morgan('dev'))
app.use(saveLog());
app.use(helmet());
app.use(cors());


module.exports = app