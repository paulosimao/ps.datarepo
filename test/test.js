var should   = require('chai').should();
var DataRepo = require('../repo');
var repo     = new DataRepo();
describe('DATAREPO TEST', function () {
	describe('REPO TEST', function () {
		it('Should insert a record', function () {
			repo.col('test1').upsert({a: 1, b: 2, c: [1, 2, 3], d: new Date()})
		});
		it('Should get records', function (done) {
			repo.col('test1').get(function (err, data) {
				console.dir(data);
				done();
			});
		});
		it('Should test filter', function (done) {
			
			repo.filters.test = function (obj) {
				return obj.a == 2;
			}

			repo.coldeleteSync('test1');

			repo.col('test1').upsertSync({a: 1, b: 2});
			repo.col('test1').upsertSync({a: 2, b: 2});
			repo.col('test1').upsertSync({a: 3, b: 2});
			repo.col('test1').upsertSync({a: 4, b: 2});


			var docs = repo.col('test1').getSync('test');

			console.dir(docs);
			done();
		});
	})
	;
})
;
