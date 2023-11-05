var express = require('express');
var router = express.Router();
const { createConnection, releaseConnection } = require('../components/db');
require('dotenv').config();

router.post('/', async function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   const bodyData = req.body;
   //verificare body post
   if (bodyData.username == null || bodyData.password == null || bodyData.username.trim() == "" || bodyData.password.trim() == "") {
      res.status(400).send(JSON.stringify({ error: "invalid JSON" }));
      return;
   }
   const dataBase = await createConnection();
   try {
      //select user
      var [rows] = await dataBase.query('SELECT * FROM users WHERE username = ? and password = ?', [
         bodyData.username,
         bodyData.password,
      ]);

      //verificare daca exista user
      if (!rows.length) {
         res.status(404).send(JSON.stringify({ error: "not found" }));
         return;
      }
      else{
         res.status(200).send(JSON.stringify({ status: "OK" }));
      }
   } catch (err) {
      res.status(401).send(JSON.stringify({ error: "database: " + err }));
   }
   releaseConnection(dataBase);
});

module.exports = router;
