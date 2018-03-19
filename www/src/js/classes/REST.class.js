import Base from './base.class';

export default class REST extends Base {
  constructor (obj) {
    super();
    Object.assign(this, obj);
  }

  async save (obj = null) {
    let entity = (this.constructor.name.endsWith('y')
      ? this.constructor.name.slice(0, -1) + 'ies'
      : this.constructor.name + 's'
    ).toLowerCase(); // + 's').toLowerCase();
    if (this._id) {
      let query = '_id=' + this._id;
      return REST.request(entity, 'PUT', query, obj || this);
    } else {
      let result = await this.constructor.create(obj || this);
      this._id = result._id;
      return result;
    }
  }

  async delete () {
    let entity = (this.constructor.name.endsWith('y')
      ? this.constructor.name.slice(0, -1) + 'ies'
      : this.constructor.name + 's'
    ).toLowerCase();
    let query = '_id=' + this._id;
    // Delete all properties
    for (let prop in this) {
      delete this[prop];
    }
    // Delete from server/DB
    return await REST.request(entity, 'DELETE', query, this);
  }

  static async find (query) {
    console.log('QUERY', query);
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
        return val;
      });
    }

    let entity = (this.name.endsWith('y')
      ? this.name.slice(0, -1) + 'ies'
      : this.name + 's'
    ).toLowerCase(); // + 's').toLowerCase();

    let results = await REST.request(entity, 'GET', query, '');
    results = results.result || [results];
    let enriched = [];
    for (let result of results) {
      enriched.push(new this(result));
    }
    return enriched;
  }

  static async findOne (query) {
    return (await this.find(query))[0];
  }

  static async create (obj) {
    let entity = (this.name.endsWith('y')
      ? this.name.slice(0, -1) + 'ies'
      : this.name + 's'
    ).toLowerCase();
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
