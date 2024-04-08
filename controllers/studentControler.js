const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('../db/db');
const jwt  = require ('jsonwebtoken')
const {promisify} = require ('util');
const { error } = require('console');
const { resume } = require('../db/db');

