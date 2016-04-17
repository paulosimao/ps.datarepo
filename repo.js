var fs     = require('fs-extra');
var path   = require('path');
var uuid   = require('uuid');
var async  = require('async');
var rimraf = require('rimraf');
var util   = require('util');

/**
 * DataRepo: Represents a data repository. Each collection is persisted in a different folder,within rootdir.
 * @param config: Config object, format:
 *  rootdir String: represents de root dir for the repo - default is './dr'
 * @constructor
 */
function DataRepo(config) {
	if (config && config.rootdir) {
		this.rootdir = config.rootdir
	} else {
		this.rootdir = './dr/'
	}
	this.filters = {};
	
	fs.mkdirsSync(this.rootdir)
	
}

/**
 * collist - lists all collections within repo..
 * @param cb
 */
DataRepo.prototype.collist = function (cb) {
	fs.readdir(this.rootdir, cb);
}
/**
 * colcreate - creates a new collection
 * @param name
 * @param cb
 */
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
/**
 * coldelete - deletes a collection within a repo; drops all documents;
 * @param name
 * @param cb
 */
DataRepo.prototype.coldelete = function (name, cb) {
	var fullpath = path.join(this.rootdir, name);
	rimraf(fullpath, cb);
	//fs.rmdir(fullpath, cb);
}
/**
 * SYNC Version - coldelete - deletes a collection within a repo; drops all documents;
 * @param name
 * @param cb
 */
DataRepo.prototype.coldeleteSync = function (name, cb) {
	var fullpath = path.join(this.rootdir, name);
	rimraf.sync(fullpath);
}

/**
 * returns a named collection out of repo. Creates it in case does not exist;
 * @param name
 * @returns {DRCol}
 */
DataRepo.prototype.col = function (name) {
	var ret = new DRCol(this, name);
	return ret;
}

/**
 * represents a Collection within a repo. Constructor should not be used directly and is not exposed by module.
 * @param p {DataRepo} - Parent repo.
 * @param name {String} - Col name
 * @constructor
 */
function DRCol(p, name) {
	this.parent   = p;
	this.name     = name;
	this.fullpath = path.join(this.parent.rootdir, name);
	fs.mkdirsSync(this.fullpath);
}
/**
 * executes upsert operation in collection for object obj. In case obj has id field, whole object update will be performed;
 * Otherwise, insert will be done
 * @param obj {Object} - Object to be persisted
 * @param cb - Callback to be called on op is finished, expects (err,doc) params where error is any error that may occour and doc is the doc as after upsert.
 */
DRCol.prototype.upsert = function (obj, cb) {
	
	if (!obj._id) {
		obj._id = uuid.v4();
	}

	if (!cb) {
		cb = function () {
		}
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
/**
 * SYNC Version - executes upsert operation in collection for object obj. In case obj has id field, whole object update will be performed;
 * Otherwise, insert will be done
 * @param obj {Object} - Object to be persisted
 */
DRCol.prototype.upsertSync = function (obj) {

	if (!obj._id) {
		obj._id = uuid.v4();
	}
	delete obj._col;
	delete obj._delete;
	delete obj._save;

	var fqdn = path.join(this.fullpath, obj._id);
	fs.writeFileSync(fqdn, JSON.stringify(obj));
	obj._col    = this;
	obj._delete = function (cb) {
		this._col.delete(this._id, cb);
	};
	obj._save   = function (cb) {
		this._col.upsert(this, cb);
	}
	obj;
}


/**
 * Deletes an object from collection
 * @param id {String} - id of object to be deleted.
 * @param cb  - Callback one op is finished.
 */
DRCol.prototype.delete = function (id, cb) {
	var fqdn = path.join(this.fullpath, id);
	fs.unlink(fqdn, cb)
}
/**
 * SYNC VERSION - Deletes an object from collection
 * @param id {String} - id of object to be deleted.
 */
DRCol.prototype.deleteSync = function (id) {
	var fqdn = path.join(this.fullpath, id);
	fs.unlinkSync(fqdn);
}
/**
 * Retrieves the content of a collection.
 * @param filter - A function for new filter os String for pre-registered ones. Register is done using :
 * repo.filters.myfilter = function(obj)..., than the string 'myfilter' can be used.
 * @param cb - Callback with params (err,docs) where docs is the collection of returned objs.
 */
DRCol.prototype.get = function (filter, cb) {
	
	if (!cb) {
		cb     = filter;
		filter = function (o) {
			return true;
		}
		
	} else if (util.isString(filter)) {
		filter = this.parent.filters[filter];
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
					obj = JSON.parse(data.toString(), reviver);
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
/**
 * SYNC VERSION - Retrieves the content of a collection.
 * @param filter - A function for new filter os String for pre-registered ones. Register is done using :
 * repo.filters.myfilter = function(obj)..., than the string 'myfilter' can be used.
 */
DRCol.prototype.getSync = function (filter) {

	if (!filter) {
		filter = function (o) {
			return true;
		}

	} else if (util.isString(filter)) {
		filter = this.parent.filters[filter];
	}

	var files = fs.readdirSync(this.fullpath);
	var ret   = [];
	for (f of files) {
		var data = fs.readFileSync(path.join(this.fullpath, f));
		obj      = JSON.parse(data.toString(), reviver);
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

	}
	return ret;
}
/**
 * Get a single doc by id
 * @param id
 * @param cb
 */
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
/**
 * SYNC VERSION - Get a single doc by id
 * @param id
 */
DRCol.prototype.getbyidSync = function (id) {

	var data    = fs.readFileSync(path.join(this.fullpath, id));
	var obj     = JSON.parse(data.toString());
	obj._col    = this;
	obj._delete = function (cb) {
		this._col.delete(this._id, cb);
	};
	obj._save   = function (cb) {
		this._col.upsert(this, cb);
	}

	return obj;
}
/**
 * each - iterates over a collection.
 * @param filter {String|function}- name or function for filtering
 * @param cbeach {function} - callback for each object in collection
 * @param cbend {function} - callback called once all objects have been interacted.
 */
DRCol.prototype.each = function (filter, cbeach, cbend) {
	
	if (!cbend) {
		cbend  = cbeach;
		cbeach = filter;
		filter = function (o) {
			return true;
		}
		
	} else if (util.isString(filter)) {
		filter = this.parent.filters[filter];
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
					obj         = JSON.parse(data.toString(), reviver);
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
/**
 * reviver: Internal function used to revive JSON with some extras
 * @param k {String} Key to be used
 * @param v {Multi} Value to be used
 * @returns {*} Value post conversion
 */
function reviver(k, v) {
	if (util.isString(v) && v.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/g)) {
		return new Date(v);
	} else {
		return v;
	}
}

module.exports = DataRepo;