'use strict';

const connectToDatabase = require('./db'); // initialize connection

// simple Error constructor for handling HTTP error codes
function HTTPError (statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log('Connection successful.');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  }
}

module.exports.createItem = async (event) => {
  try {
    const { Item } = await connectToDatabase();
    const item = await Item.create(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(item)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the item.'
    }
  }
}

module.exports.getOneItem = async (event) => {
  try {
    const { Item } = await connectToDatabase();
    const item = await Item.findById(event.pathParameters.id);
    if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
    return {
      statusCode: 200,
      body: JSON.stringify(item)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not fetch the Item.'
    }
  }
}

module.exports.getAllItems = async () => {
  try {
    const { Item } = await connectToDatabase();
    const items = await Item.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the items.'
    }
  }
}

module.exports.updateItems = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const { Item } = await connectToDatabase();
    const item = await Item.findById(event.pathParameters.id);
    if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
    if (input.title) item.title = input.title;
    if (input.description) item.description = input.description;
    await item.save();
    return {
      statusCode: 200,
      body: JSON.stringify(item)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not update the Item.'
    }
  }
}

module.exports.destroyItem = async (event) => {
  try {
    const { Item } = await connectToDatabase();
    const item = await Item.findById(event.pathParameters.id);
    if (!item) throw new HTTPError(404, `Item with id: ${event.pathParameters.id} was not found`);
    await item.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(item)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could destroy fetch the Item.'
    }
  }
}