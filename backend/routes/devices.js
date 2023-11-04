var express = require('express');
var router = express.Router();
require('dotenv').config();
const generatorUUID = require("uuid");

const { createConnection, releaseConnection } = require('../components/db');

router.get('/', async function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');

   const dataBase = await createConnection();

   [rows] = await dataBase.query('SELECT * FROM devices', []);

   res.status(200).send(rows);
   releaseConnection(dataBase);
   
});

router.post('/', async function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');

   const dataBase = await createConnection();

   const bodyData = req.body;

   if (bodyData.token != undefined && bodyData.token == process.env.AUTH_POST_ADD_DEVICES) {
      if (bodyData.name != undefined && bodyData.lat != undefined && bodyData.long != undefined &&
         bodyData.name.trim() != "" && bodyData.lat.trim() != "" && bodyData.long.trim() != "" 
         ) 
      {
         var uuid = generatorUUID.v1();
         await dataBase.execute('INSERT INTO devices (uuid, name, lat, longi) VALUES (?, ?, ?, ?)', [
            uuid,
            bodyData.name,
            bodyData.lat,
            bodyData.long,
         ])
         res.status(201).send(JSON.stringify({}));
      }
      else {
         res.status(400).send(JSON.stringify({ error: "JSON invalid" }));
      }
   }
   else {
      res.status(401).send(JSON.stringify({ error: "auth invalid" }));
   }
   releaseConnection(dataBase);
});

module.exports = router;
