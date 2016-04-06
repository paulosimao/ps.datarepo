# ps.datarepo
Simple data repository based on filesystem

Ok, what´s the history here. I found that depending on mongo or redis for some small stuff was too much. Also some devices, like Raspberry PI or Termux on Android do not support it propperly or it takes a while and some respectable resource to get small things done.
Conclusion, I implemented datarepo, a very, very simple solution to persist data in the filesystem.
Once it reaches maturity, it will be refactored to a more event driven model, with stronger interfaces, so a more modular approach can be applied.

At the moment, the solution is base on repo.js that implemets a facade for the repository, with the follwoing methods:

    #Repo Methods
    DataRepo.prototype.collist   = function (cb): Reads all collections available in a repo
    DataRepo.prototype.colcreate = function (name, cb): Creates a collection
	DataRepo.prototype.coldelete = function (name, cb): Deletes a collection (and all contents)
	DataRepo.prototype.col       = function (name): Returns a collection object instance (creates in case it does not exist).


    #Collection Methods
    DRCol.prototype.upsert  = function (obj, cb): Inserts an object in a collection, returs object filled w ID to callback
	DRCol.prototype.delete  = function (id, cb): Deletes an object
    DRCol.prototype.get     = function (filter, cb): retrieve multiple objects based on filter (filter to be implemented at the moment - returns everything at the moment).
    DRCol.prototype.getbyid = function (id, cb): returns a sigle obj based on ind
    DRCol.prototype.each    = function (filter, cbeach, cbend):iterates over a collection on e resource frienly manner - cbeach is called for every objetc, cbend at the end of processing.

Also in the package you will find:
* serverapi.js - it exposes repo.js as HTML API.
* config.js - configuration file for this package
* serverrunner.js - program to run server API gathering parameters from config.
* index.js - entry point for this package
* client.js - client lib for the serverapi facade. Its a proxy object for repo.js on top of http.

