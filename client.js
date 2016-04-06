/**
 * Created by paulo.simao on 29/03/2016.
 */
var request = require('request');
var Client  = function (url) {
	this.url = url;
}

Client.prototype.collist   = function (cb) {
	var self = this;
	request({uri: self.url + '/cs', method: 'GET'}, function (err, res, body) {
		if (err)
			return cb(err)
		return cb(null, JSON.parse(body));
	});
}
Client.prototype.coldelete = function (name, cb) {
	var self = this;
	request({uri: self.url + '/cs/' + name, method: 'DELETE'}, function (err, res, body) {
		if (err)
			return cb(err)
		return cb(null, JSON.parse(body));
	});
}
Client.prototype.col = function (name) {
	return new ClientCol(this, name);
}

var ClientCol = function (cli, name) {
	this.cli  = cli;
	this.name = name;
}

ClientCol.prototype.upsert = function (obj, cb) {
	var self = this;
	request({uri: self.cli.url + '/c/' + self.name, method: 'POST', body: JSON.stringify(obj)},
		function (err, res, body) {
			if (err)
				return cb(err)
			return cb(null, JSON.parse(body));
		}
	);
}
ClientCol.prototype.delete = function (id, cb) {
	var self = this;
	request({uri: self.cli.url + '/c/' + self.name + '/' + id, method: 'DELETE'},
		function (err, res, body) {
			if (err)
				return cb(err)
			return cb(null, JSON.parse(body));
		}
	);
}
ClientCol.prototype.get    = function (cb) {
	var self = this;
	request({uri: self.cli.url + '/c/' + self.name, method: 'GET'},
		function (err, res, body) {
			if (err)
				return cb(err)
			return cb(null, JSON.parse(body));
		}
	);
}
ClientCol.prototype.geti   = function (id, cb) {
	var self = this;
	request({uri: self.cli.url + '/ci/' + self.name + '/' + id, method: 'GET'},
		function (err, res, body) {
			if (err)
				return cb(err)
			return cb(null, JSON.parse(body));
		}
	);
}


function getjsonfromres(res, cb) {
	var chuncks = [];
	res.on('data', function (chunk) {
		chuncks.push(chunk);
	});

	res.on('end', function () {
		var obj = Buffer.concat(chuncks).toJSON()
		returncb(null, obj);
	});
}

module.exports = Client;