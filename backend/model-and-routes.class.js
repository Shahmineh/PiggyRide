const qs = require('qs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo_books');
const db = mongoose.connection;
db.on('error', (e)=>{ console.error(e); });
db.once('open', ()=>{ console.info('db connected');});

module.exports = class ModelAndRoutes {

  // In subclasses we expect the getter
  // schema to exist - an object corresponding
  // to a mongoose schema
  static get schema(){
    return {};
  }

  constructor(expressApp){
    this.expressApp = expressApp;
    let schema = new mongoose.Schema(this.constructor.schema);
    this.modelName = this.constructor.name;
    this.routeName = this.modelName.toLowerCase() + 's';
    this.myModel = mongoose.model(this.modelName, schema);
    this.setupPostRoute();
    this.setupGetRoute();
    this.setupDeleteRoute();
    this.setupPutRoute();
  }

  setupImportRoute(arrayOfObjects){
    this.expressApp.get(`/import/${this.routeName}`, (req, res)=>{
      // empty old items in collection
      this.myModel.remove({}, ()=>{
        // perform a new clean import
        this.myModel.create(arrayOfObjects, ()=>{
          res.json('imported data');
        });
      });
    });
  }

  setupPostRoute(){
    this.expressApp.post(`/${this.routeName}`, (req, res) =>{
      let entity = new this.myModel(req.body);
      entity.save(() => {
        // Newly created and saved Mongoose object
        // with  _id and __v properties
        res.json(entity);
      });
    });
  }

  setupGetRoute(){
    this.expressApp.get(`/${this.routeName}/?*`, (req, res)=>{

      let params;

      // check if params is a stringified object
      try {
        let obj = JSON.parse(req.params[0]);
        if(typeof obj == 'object'){
          params = obj;
        }
      }
      catch(e){}

      // get params
      params = params || qs.parse(req.params[0]);

      console.log("PPPP",params)

      // Get populate instructions
      // and then delete them from the Mongo query params
      let populate = params.populate || '';
      delete params.populate;

      this.myModel.find(params).populate(populate).exec((err, data)=>{
        res.json({
          query:params,
          resultLength: data.length,
          result: data
        });
      });
    });
  }

  setupDeleteRoute(){

    this.expressApp.delete(`/${this.routeName}/?*`, (req, res) => {
      // get params
      let params = qs.parse(req.params[0]);
      this.myModel.find(params, (err, data) => {
        if(err){
          res.json(err);
        }
        else {
          let numberOfItems = data.length;
          let response = {numberOfItems: numberOfItems};
          if(numberOfItems === 0){
            response.error = 'No items to remove';
            res.json(response);
          }
          else if (numberOfItems > 5){
            response.error = 'Do not remove more than 5 items at once';
            res.json(response);
          }
          else {
            this.myModel.remove(params, (err) => {
              if(err){
                response.error = err;
              }
              else {
                response.success = `${this.modelName}s removed!`;
              }
              res.json(response);
            });
          }

        }
      });

    });

  }

  setupPutRoute(){
    this.expressApp.put(`/${this.routeName}/?*`, (req, res) => {
      // get params
      let params = qs.parse(req.params[0]);
      this.myModel.find(params, (err, data) => {
        if(err){
          res.json(err);
        }
        else {
          let numberOfItems = data.length;
          let response = {numberOfItems: numberOfItems};
          if(numberOfItems === 0){
            response.error = 'No items to update';
            res.json(response);
          }
          else if (numberOfItems > 5){
            response.error = 'Do not update more than 5 items at once';
            res.json(response);
          }
          else {
            this.myModel.update(params, req.body, {multi: true}, (err) => {
              if(err){
                response.error = err;
              }
              else {
                response.success = `${this.modelName}s updated!`;
              }
              res.json(response);
            });
          }

        }
      });

    });
  }

}