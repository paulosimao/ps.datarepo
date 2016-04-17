## Classes

<dl>
<dt><a href="#DataRepo">DataRepo</a></dt>
<dd></dd>
<dt><a href="#DRCol">DRCol</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#reviver">reviver(k, v)</a> ⇒ <code>*</code></dt>
<dd><p>reviver: Internal function used to revive JSON with some extras</p>
</dd>
</dl>

<a name="DataRepo"></a>

## DataRepo
**Kind**: global class  

* [DataRepo](#DataRepo)
    * [new DataRepo(config:)](#new_DataRepo_new)
    * [.collist(cb)](#DataRepo+collist)
    * [.colcreate(name, cb)](#DataRepo+colcreate)
    * [.coldelete(name, cb)](#DataRepo+coldelete)
    * [.coldeleteSync(name, cb)](#DataRepo+coldeleteSync)
    * [.col(name)](#DataRepo+col) ⇒ <code>[DRCol](#DRCol)</code>

<a name="new_DataRepo_new"></a>

### new DataRepo(config:)
DataRepo: Represents a data repository. Each collection is persisted in a different folder,within rootdir.


| Param | Description |
| --- | --- |
| config: | Config object, format:  rootdir String: represents de root dir for the repo - default is './dr' |

<a name="DataRepo+collist"></a>

### dataRepo.collist(cb)
collist - lists all collections within repo..

**Kind**: instance method of <code>[DataRepo](#DataRepo)</code>  

| Param |
| --- |
| cb | 

<a name="DataRepo+colcreate"></a>

### dataRepo.colcreate(name, cb)
colcreate - creates a new collection

**Kind**: instance method of <code>[DataRepo](#DataRepo)</code>  

| Param |
| --- |
| name | 
| cb | 

<a name="DataRepo+coldelete"></a>

### dataRepo.coldelete(name, cb)
coldelete - deletes a collection within a repo; drops all documents;

**Kind**: instance method of <code>[DataRepo](#DataRepo)</code>  

| Param |
| --- |
| name | 
| cb | 

<a name="DataRepo+coldeleteSync"></a>

### dataRepo.coldeleteSync(name, cb)
SYNC Version - coldelete - deletes a collection within a repo; drops all documents;

**Kind**: instance method of <code>[DataRepo](#DataRepo)</code>  

| Param |
| --- |
| name | 
| cb | 

<a name="DataRepo+col"></a>

### dataRepo.col(name) ⇒ <code>[DRCol](#DRCol)</code>
returns a named collection out of repo. Creates it in case does not exist;

**Kind**: instance method of <code>[DataRepo](#DataRepo)</code>  

| Param |
| --- |
| name | 

<a name="DRCol"></a>

## DRCol
**Kind**: global class  

* [DRCol](#DRCol)
    * [new DRCol(p, name)](#new_DRCol_new)
    * [.upsert(obj, cb)](#DRCol+upsert)
    * [.upsertSync(obj)](#DRCol+upsertSync)
    * [.delete(id, cb)](#DRCol+delete)
    * [.deleteSync(id)](#DRCol+deleteSync)
    * [.get(filter, cb)](#DRCol+get)
    * [.getSync(filter)](#DRCol+getSync)
    * [.getbyid(id, cb)](#DRCol+getbyid)
    * [.getbyidSync(id)](#DRCol+getbyidSync)
    * [.each(filter, cbeach, cbend)](#DRCol+each)

<a name="new_DRCol_new"></a>

### new DRCol(p, name)
represents a Collection within a repo. Constructor should not be used directly and is not exposed by module.


| Param | Type | Description |
| --- | --- | --- |
| p | <code>[DataRepo](#DataRepo)</code> | Parent repo. |
| name | <code>String</code> | Col name |

<a name="DRCol+upsert"></a>

### drCol.upsert(obj, cb)
executes upsert operation in collection for object obj. In case obj has id field, whole object update will be performed;Otherwise, insert will be done

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to be persisted |
| cb |  | Callback to be called on op is finished, expects (err,doc) params where error is any error that may occour and doc is the doc as after upsert. |

<a name="DRCol+upsertSync"></a>

### drCol.upsertSync(obj)
SYNC Version - executes upsert operation in collection for object obj. In case obj has id field, whole object update will be performed;Otherwise, insert will be done

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to be persisted |

<a name="DRCol+delete"></a>

### drCol.delete(id, cb)
Deletes an object from collection

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of object to be deleted. |
| cb |  | Callback one op is finished. |

<a name="DRCol+deleteSync"></a>

### drCol.deleteSync(id)
SYNC VERSION - Deletes an object from collection

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of object to be deleted. |

<a name="DRCol+get"></a>

### drCol.get(filter, cb)
Retrieves the content of a collection.

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Description |
| --- | --- |
| filter | A function for new filter os String for pre-registered ones. Register is done using : repo.filters.myfilter = function(obj)..., than the string 'myfilter' can be used. |
| cb | Callback with params (err,docs) where docs is the collection of returned objs. |

<a name="DRCol+getSync"></a>

### drCol.getSync(filter)
SYNC VERSION - Retrieves the content of a collection.

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Description |
| --- | --- |
| filter | A function for new filter os String for pre-registered ones. Register is done using : repo.filters.myfilter = function(obj)..., than the string 'myfilter' can be used. |

<a name="DRCol+getbyid"></a>

### drCol.getbyid(id, cb)
Get a single doc by id

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param |
| --- |
| id | 
| cb | 

<a name="DRCol+getbyidSync"></a>

### drCol.getbyidSync(id)
SYNC VERSION - Get a single doc by id

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param |
| --- |
| id | 

<a name="DRCol+each"></a>

### drCol.each(filter, cbeach, cbend)
each - iterates over a collection.

**Kind**: instance method of <code>[DRCol](#DRCol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>String</code> &#124; <code>function</code> | name or function for filtering |
| cbeach | <code>function</code> | callback for each object in collection |
| cbend | <code>function</code> | callback called once all objects have been interacted. |

<a name="reviver"></a>

## reviver(k, v) ⇒ <code>\*</code>
reviver: Internal function used to revive JSON with some extras

**Kind**: global function  
**Returns**: <code>\*</code> - Value post conversion  

| Param | Type | Description |
| --- | --- | --- |
| k | <code>String</code> | Key to be used |
| v | <code>Multi</code> | Value to be used |

