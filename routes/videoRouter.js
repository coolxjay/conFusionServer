
const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
const videoRouter = express.Router();
const cors = require('./cors');
const fs = require('fs');
const path = require('path');

videoRouter.use(bodyParser.json());


videoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {

  const path = 'public/videos/sample.mp4';
  if( !fs.existsSync(path) ) {
    res.statusCode = 203;
    res.end("No such file");
  } 
  else {
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1;
      const chunksize = (end-start)+1;
      const file = fs.createReadStream(path, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  }

})
.post(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
	res.stsatusCode = 204;
	res.end('POST operation is not ready yet');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
	res.stsatusCode = 204;
	res.end('POST operation is not ready yet');
});

module.exports = videoRouter;