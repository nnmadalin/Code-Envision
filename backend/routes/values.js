var express = require('express');
var router = express.Router();
require('dotenv').config();

const {createConnection, releaseConnection} = require('../components/db');

router.get('/', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  try{
    const dataBase = await createConnection();
    
    [rows] = await dataBase.query('SELECT * FROM devices_values', []);

    res.status(200).send(rows);
  }
  catch{
    res.status(500);
  }
});

router.post('/', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  try{
    const dataBase = await createConnection();

    const bodyData = req.body;
    
    if(bodyData.token != undefined && bodyData.token == process.env.AUTH_POST_ADD_DATA){
      if(bodyData.uuid != undefined && bodyData.humidity != undefined && bodyData.temperature != undefined && bodyData.mqvalue != undefined && bodyData.pm25 != undefined 
        && bodyData.pm1 != undefined &&
        bodyData.uuid.trim() != "" && bodyData.humidity.trim() != "" && bodyData.temperature.trim() != "" && bodyData.mqvalue.trim() != "" && bodyData.pm25.trim() != "" 
        && bodyData.pm1.trim() != ""
        )
      {
        await dataBase.execute('INSERT INTO devices_values (uuid, humidity, temperature, mqvalue, pm25, pm1, added_on) VALUES (?, ?, ?, ?, ?, ?, NOW())', [
          bodyData.uuid,
          bodyData.humidity,
          bodyData.temperature,
          bodyData.mqvalue,
          bodyData.pm25,
          bodyData.pm1,
        ])
        res.status(201).send(JSON.stringify({}));
      }
      else{
        res.status(400).send(JSON.stringify({error:"JSON invalid"}));
      }
    }
    else{
      res.status(401).send(JSON.stringify({error:"auth invalid"}));
    }
    
  }
  catch{
    res.status(500);
  }
});

module.exports = router;
