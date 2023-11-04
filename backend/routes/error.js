var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.post('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.options('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.put('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.delete('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.patch('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});
router.head('/', function (req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(404);
   res.end(JSON.stringify({ error: "route not found" }));
});

module.exports = router;
