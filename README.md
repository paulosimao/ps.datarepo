# ps.datarepo
Simple data repository based on filesystem

Ok, what´s the history here. I found that depending on mongo or redis for some small stuff was too much. Also some devices, like Raspberry PI or Termux on Android do not support it propperly or it takes a while and some respectable resource to get small things done.
Conclusion, I implemented datarepo, a very, very simple solution to persist data in the filesystem.
Once it reaches maturity, it will be refactored to a more event driven model, with stronger interfaces, so a more modular approach can be applied.

At the moment, the solution is base on repo.js that implemets a facade for the repository - please see [repo](./repo.md). with the follwoing methods:

Also in the package you will find:
* serverapi.js - it exposes repo.js as HTML API.
* config.js - configuration file for this package
* serverrunner.js - program to run server API gathering parameters from config.
* index.js - entry point for this package
* client.js - client lib for the serverapi facade. Its a proxy object for repo.js on top of http.

