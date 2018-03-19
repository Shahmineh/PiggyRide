import Base from './base.class';

export default class REST extends Base {
  constructor (obj) {
    super();
    Object.assign(this, obj);
  }

  async save () {
    let entity = (this.constructor.name + 's').toLowerCase();
    let query = '_id=' + this._id;
    return await REST.request(entity, 'PUT', query, this);
  }

  async delete () {
    let entity = (this.constructor.name + 's').toLowerCase();
    let query = '_id=' + this._id;
    // Delete all properties
    for (let prop in this) {
      delete this[prop];
    }
    // Delete from server/DB
    return await REST.request(entity, 'DELETE', query, this);
  }


  static async find (query) {
    //console.log('QUERY', query);
    if (typeof query === 'object') {
      query = JSON.stringify(query, (key, val) => {
        if (val && val.constructor === RegExp) {
          val = val + '';
          val = val.split('/');
          let op = val.pop();
          val = val.join('/');
          val = val.substr(1, val.length - 1);

          val = { $regex: val, $options: op };
          
        }
        //console.log('VAL', val);
        return val;
      });
    }

    let entity = (this.name + 's').toLowerCase();
    //console.log('ENTITY', entity);

    let results = await REST.request(entity, 'GET', query, '');
    results = results.result || [results];
    //console.log('RESULTS', results);
    
    let enriched = [];
    for (let result of results) {
      enriched.push(new this(result));
      //console.log('RESULT', result);
    }
    
    console.log('ENRICHED', enriched[0]);
    return enriched;
  }

  static async findOne (query) {
    return (await this.find(query))[0];
  }

  static async create (obj) {
    let entity = (this.name + 's').toLowerCase();
    let result = await REST.request(entity, 'POST', '', obj);
    return new this(result);
  }

  static async request (entity, reqMethod, query, body = {}) {
    let reqObj = {
      url: `/${entity}/${query}`, // entity for example "books"
      method: reqMethod, // POST, GET, PUT, DELETE
      dataType: 'json', // I except JSON back from the server
      data: JSON.stringify(body), // JSON to send to server
      processData: false, // do not try to convert the data...
      // set the content type the server expects
      // to tell it we are sending json
      contentType: 'application/json; charset=utf-8'
    };

    if (reqMethod !== 'POST' && reqMethod !== 'PUT') {
      delete reqObj.data;
    }

    return await $.ajax(reqObj);
  }
}
