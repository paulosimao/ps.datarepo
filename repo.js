var fs     = require('fs-extra');
var path   = require('path');
var uuid   = require('uuid');
var async  = require('async');
var rimraf = require('rimraf');
function DataRepo(config) {
	if (config && config.rootdir) {
		this.rootdir = config.rootdir
	} else {
		this.rootdir = './dr/'
	}

	fs.mkdirsSync(this.rootdir)

}

DataRepo.prototype.collist   = function (cb) {
	fs.readdir(this.rootdir, cb);
}
DataRepo.prototype.colcreate = function (name, cb) {
	var fullpath = path.join(this['rootdir'], name);
	fs.mkdirs(fullpath, (err)=> {
		if (err) {
			return cb(err);
		} else {
			return cb(null, new DRCol(this, name));
		}
	});
}
DataRepo.prototype.coldelete = function (name, cb) {
	var fullpath = path.join(this.rootdir, name);
	rimraf(fullpath, cb);
	//fs.rmdir(fullpath, cb);
}
DataRepo.prototype.col       = function (name) {
	var ret = new DRCol(this, name);
	return ret;
}

function DRCol(p, name) {
	this.parent   = p;
	this.name     = name;
	this.fullpath = path.join(this.parent.rootdir, name);
	fs.mkdirsSync(this.fullpath);
}

DRCol.prototype.upsert  = function (obj, cb) {
	if (!obj._id) {
		obj._id = uuid.v4();
	}
	delete obj._col;
	delete obj._delete;
	delete obj._save;

	var fqdn = path.join(this.fullpath, obj._id);
	fs.writeFile(fqdn, JSON.stringify(obj), (err)=> {
		if (err) {
			return cb(err, null);
		} else {
			obj._col    = this;
			obj._delete = function (cb) {
				this._col.delete(this._id, cb);
			};
			obj._save   = function (cb) {
				this._col.upsert(this, cb);
			}
			return cb(null, obj);
		}
	});
}
DRCol.prototype.delete  = function (id, cb) {
	var fqdn = path.join(this.fullpath, id);
	fs.unlink(fqdn, cb)
}
DRCol.prototype.get     = function (filter, cb) {

	if (!cb) {
		cb     = filter;
		filter = function (o) {
			return true;
		}

	}

	fs.readdir(this.fullpath, (err, files)=> {
		if (err) {
			return cb(err, null);
		}
		var ret = [];
		async.each(files, (f, cb)=> {
			fs.readFile(path.join(this.fullpath, f), function (err, data) {
				if (err) {
					return cb(err);
				} else {
					obj = JSON.parse(data.toString());
					if (filter(obj)) {
						obj._col    = this;
						obj._delete = function (cb) {
							this._col.delete(this._id, cb);
						};
						obj._save   = function (cb) {
							this._col.upsert(this, cb);
						}
						ret.push(obj);
					}
					cb();
				}
			});
		}, function (err) {
			if (err) {
				return cb(err, null);
			} else {
				return cb(null, ret);
			}
		});
	});
}
DRCol.prototype.getbyid = function (id, cb) {

	fs.readFile(path.join(this.fullpath, id), function (err, data) {
		if (err) {
			return cb(err);
		} else {
			obj         = JSON.parse(data.toString());
			obj._col    = this;
			obj._delete = function (cb) {
				this._col.delete(this._id, cb);
			};
			obj._save   = function (cb) {
				this._col.upsert(this, cb);
			}
			cb(null, obj);
			
		}
	});


}
DRCol.prototype.each    = function (filter, cbeach, cbend) {

	if (!cbend) {
		cbend  = cbeach;
		cbeach = filter;
		filter = function (o) {
			return true;
		}

	}


	fs.readdir(this.fullpath, (err, files)=> {
		if (err) {
			return cb(err, null);
		}
		var ret = [];
		async.each(files, (f, cb)=> {
			fs.readFile(path.join(this.fullpath, f), function (err, data) {
				if (err) {
					return cb(err);
				} else {
					obj         = JSON.parse(data.toString());
					obj._col    = this;
					obj._delete = function (cb) {
						this._col.delete(this._id, cb);
					};
					obj._save   = function (cb) {
						this._col.upsert(this, cb);
					}
					if (filter(obj)) {
						process.nextTick(function () {
							cbeach(obj)
						});
					}

					cb();
				}
			});
		}, function (err) {
			if (err) {
				return cbend(err);
			} else {
				process.nextTick(function () {
					return cbend(null);
				})

			}
		});
	});
}

module.exports = DataRepo;