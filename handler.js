const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const pool = require('./configs/dbConfig');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handle GET route for all items
app.get('/items/', (req, res) => {
    const query = 'SELECT * FROM uptown_shopper_db';
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response);
      }
  
      const items = [...results];
      const response = {
        data: items,
        message: 'All items successfully retrieved.',
      }
      res.send(response);
    })
  })
  
  // handle GET route for specific item
  app.get('/items/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM uptown_shopper_db WHERE id=${id}`;
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response);
      }
  
      const item = results[0];
      const response = {
        data: item,
        message: `item ${item.name} successfully retrieved.`,
      }
      res.status(200).send(response);
    })
  })
  
  // handle POST route
  app.post('/items/', (req, res) => {
    const { name, type, active, note } = req.body;
    const query = `INSERT INTO uptown_shopper_db (name, type, active, note) VALUES ('${name}', '${type}', '${active}', '${note}')`;
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response);
      }
  
      const { insertId } = results;
      const item = { id: insertId, name, type, active, note }
      const response = {
        data: item,
        message: `item ${name} successfully added.`,
      }
      res.status(201).send(response);
    })
  })
  
  // handle PUT route
  app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM uptown_shopper_db WHERE id=${id} LIMIT 1`;
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response);
      }
  
      const { id, name, type, active, note } = { ...results[0], ...req.body }
      const query = `UPDATE uptown_shopper_db SET name='${name}', type='${type}', active='${active}', note='${note}' WHERE id='${id}'`;
      pool.query(query, (err, results, fields) => {
        if (err) {
          const response = { data: null, message: err.message, }
          res.send(response);
        }
  
        const item = {
          id,
          name,
          type,
          active,
          note,
        }
        const response = {
          data: item,
          message: `item ${name} is successfully updated.`,
        }
        res.send(response);
      })
    })
  })
  
  // handle DELETE route
  app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM uptown_shopper_db WHERE id=${id}`;
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message }
        res.send(response);
      }
  
      const response = {
        data: null,
        message: `item with id: ${id} successfully deleted.`,
      }
      res.send(response);
    })
  })
  
  // handle invalid route
  app.all('*', function(req, res) {
    const response = { data: null, message: 'Route not found!!' }
    res.status(400).send(response);
  })
  
  // wrap express app instance with serverless http function
  module.exports.handler = serverless(app);
  
// const connectToDatabase = require('./configs/dbConfig'); 

// simple Error constructor for handling HTTP error codes
// function HTTPError (statusCode, message) {
//   const error = new Error(message);
//   error.statusCode = statusCode;
//   return error;
// }

// module.exports.healthCheck = async () => {
//   await connectToDatabase();
//   console.log('Connection successful.');
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Connection successful.' })
//   }
// }

// module.exports.createItem = async (event) => {
//   try {
//     const { Item } = await connectToDatabase();

//     const item = await Item.create(JSON.parse(event.body));

//     return {
//       statusCode: 200,
//       body: JSON.stringify(item)
//     }
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { 'Content-Type': 'text/plain' },
//       body: 'Could not create the item.'
//     }
//   }
// }

// module.exports.getOneItem = async (event) => {
//   try {
//     const { Item } = await connectToDatabase();
//     const item = await Item.findById(event.pathParameters.id);
//     if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(item)
//     }
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { 'Content-Type': 'text/plain' },
//       body: err.message || 'Could not fetch the Item.'
//     }
//   }
// }

// module.exports.getAllItems = async () => {
//   try {
//     const { Item } = await connectToDatabase();
//     const items = await Item.findAll();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(items)
//     }
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { 'Content-Type': 'text/plain' },
//       body: 'Could not fetch the items.'
//     }
//   }
// }

// module.exports.updateItems = async (event) => {
//   try {
//     const input = JSON.parse(event.body);
//     const { Item } = await connectToDatabase();
//     const item = await Item.findById(event.pathParameters.id);
//     if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
//     if (input.title) item.title = input.title;
//     if (input.description) item.description = input.description;
//     await item.save();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(item)
//     }
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { 'Content-Type': 'text/plain' },
//       body: err.message || 'Could not update the Item.'
//     }
//   }
// }

// module.exports.destroyItem = async (event) => {
//   try {
//     const { Item } = await connectToDatabase();
//     const item = await Item.findById(event.pathParameters.id);
//     if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
//     await item.destroy();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(item)
//     }
//   } catch (err) {
//     return {
//       statusCode: err.statusCode || 500,
//       headers: { 'Content-Type': 'text/plain' },
//       body: err.message || 'Could destroy fetch the Item.'
//     }
//   }
// }