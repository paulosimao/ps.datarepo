/**
 * Created by paulo.simao on 28/03/2016.
 */

module.exports = function (config) {


	var express  = require('express');
	var DataRepo = require('./repo');

	var app = express();
	var dr  = new DataRepo(config);

	var bodyParser = require('body-parser');
	app.use(bodyParser.json())

	if (config.allowlocalhostonly) {
		app.use(function (req, res, next) {
			var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			if (ip == '127.0.0.1' || ip == '::1' || ip == "::ffff:127.0.0.1") { // exit if it's a particular ip
				next();
			} else {
				res.writeHead(400, 'FORBIDDEN');
				res.end();
			}
		});
	}


	app.get('/c/:col', (req, res)=> {
		dr.col(req.params.col).get(function (err, data) {
			for (d of data) {
				delete d._col;
				delete d._save;
				delete d._delete;
			}
			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				res.json({status: 'ok', ret: data});
				res.end();
			}
		})
	});

	app.get('/ci/:col/:id', (req, res)=> {
		dr.col(req.params.col).getbyid(req.params.id, function (err, d) {

			delete d._col;
			delete d._save;
			delete d._delete;

			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				res.json({status: 'ok', ret: d});
				res.end();
			}
		})
	});


	app.post('/c/:col', (req, res)=> {

		dr.col(req.params.col).upsert(req.body, function (err, d) {
			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				delete d._col;
				delete d._save;
				delete d._delete;

				res.json({status: 'ok', ret: d});
				res.end();
			}
		});

	});
	app.put('/c/:col/:id', (req, res)=> {

		req.body._id = req.params.id;

		dr.col(req.params.col).upsert(req.body, function (err, d) {
			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				delete d._col;
				delete d._save;
				delete d._delete;

				res.json({status: 'ok', ret: d});
				res.end();
			}
		});
	});
	app.delete('/c/:col/:id', (req, res)=> {
		dr.col(req.params.col).delete(req.params.id, function (err, ret) {
			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				res.json({status: 'ok', ret: ret});
				res.end();
			}
		});
	});
	app.get('/cs', (req, res)=> {
		dr.collist(function (err, cols) {
			res.json({status: 'ok', ret: cols});
			res.end();
		});
	});
	app.delete('/cs/:col', (req, res)=> {
		dr.coldelete(req.params.col, function (err, ret) {
			if (err) {
				res.json({status: 'error', err: err});
				res.end();
			} else {
				res.json({status: 'ok', ret: ret});
				res.end();
			}
		});
	});
	app.listen(config.port, function () {
		console.log(`Example app listening on port ${config.port}!`);
	});
}