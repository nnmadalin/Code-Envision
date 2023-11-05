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
      if (bodyData.name != undefined && bodyData.lat != undefined && bodyData.long != undefined && bodyData.street != undefined
         ) 
      {
         var uuid = generatorUUID.v1();
         await dataBase.execute('INSERT INTO devices (uuid, name, lat, longi, street) VALUES (?, ?, ?, ?, ?)', [
            uuid,
            bodyData.name,
            bodyData.lat,
            bodyData.long,
            bodyData.street
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

router.put('/', async function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');

   const dataBase = await createConnection();

   const bodyData = req.body;

   if (bodyData.username != undefined && bodyData.password != undefined && bodyData.name != undefined && bodyData.lat != undefined && bodyData.long != undefined) 
   {
      var [rows] = await dataBase.query('SELECT * FROM users WHERE username = ? and password = ?', [
         bodyData.username,
         bodyData.password
      ]);

      //verificare daca exista user
      if (!rows.length) {
         res.status(404).send(JSON.stringify({ error: "not found account" }));
         return;
      }
      else{
         var uuid = req.query.uuid;
         await dataBase.execute('UPDATE devices SET name = ?, lat = ?, longi = ?, street = ? WHERE uuid = ?', [
            bodyData.name,
            bodyData.lat,
            bodyData.long,
            bodyData.street,
            uuid
         ]);
         res.status(201).send(JSON.stringify({}));
      }
   }
   else {
      res.status(400).send(JSON.stringify({ error: "JSON invalid" }));
   }
   releaseConnection(dataBase);
});

router.delete('/', async function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');

   const dataBase = await createConnection();

   const bodyData = req.body;

   if (bodyData.username != undefined && bodyData.password != undefined && bodyData.name != undefined && bodyData.lat != undefined && bodyData.long != undefined
      ) 
   {
      var [rows] = await dataBase.query('SELECT * FROM users WHERE username = ? and password = ?', [
         bodyData.username,
         bodyData.password,
      ]);

      //verificare daca exista user
      if (!rows.length) {
         res.status(404).send(JSON.stringify({ error: "not found account" }));
         return;
      }
      else{
         var uuid = req.query.uuid;
         await dataBase.execute('DELETE from devices WHERE uuid = ?', [
            uuid
         ])
         res.status(201).send(JSON.stringify({}));
      }
   }
   else {
      res.status(400).send(JSON.stringify({ error: "JSON invalid" }));
   }
   releaseConnection(dataBase);
});



module.exports = router;
