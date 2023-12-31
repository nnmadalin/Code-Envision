var express = require('express');
var router = express.Router();
require('dotenv').config();

const {createConnection, releaseConnection} = require('../components/db');

router.get('/', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  const dataBase = await createConnection();
    
  [rows] = await dataBase.query('SELECT * FROM devices_values', []);
  
  res.status(200).send(rows);
  releaseConnection(dataBase);
  
});

router.post('/', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  
  const dataBase = await createConnection();

  const bodyData = req.body;
  
  if(bodyData.token != undefined && bodyData.mac != undefined){
    [rows] = await dataBase.query('SELECT * FROM devices_tokens where mac = ? and token = ?', [bodyData.mac, bodyData.token]);


    if(Object.keys(rows).length === 0)
    {
      res.status(401).send(JSON.stringify({error:"auth invalid"}));
    }
    else{
      if(bodyData.humidity != undefined && bodyData.temperature != undefined && bodyData.mqvalue != undefined && bodyData.pm25 != undefined 
        && bodyData.pm1 != undefined &&
        bodyData.humidity.trim() != "" && bodyData.temperature.trim() != "" && bodyData.mqvalue.trim() != "" && bodyData.pm25.trim() != "" 
        && bodyData.pm1.trim() != ""
        )
      {
        try{
          await dataBase.execute('INSERT INTO devices_values (uuid, humidity, temperature, mqvalue, pm25, pm1, added_on) VALUES (?, ?, ?, ?, ?, ?, NOW())', [
            "123",
            bodyData.humidity,
            bodyData.temperature,
            bodyData.mqvalue,
            bodyData.pm25,
            bodyData.pm1,
          ]);
        }
        catch(e){
          console.log(e);
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomToken = '';
        for (let i = 0; i < 256; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomToken += characters[randomIndex];
        }

        await dataBase.execute('UPDATE devices_tokens SET token = ? where mac = ? and token = ?', [randomToken, bodyData.mac, bodyData.token]);
        releaseConnection(dataBase);
        res.status(201).send(randomToken);
      }
      else{
        res.status(400).send(JSON.stringify({error:"JSON invalid"}));
      }
    }
  }
    
});

module.exports = router;
