const { getConnectedClient } = require("../database");

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

module.exports = { getCollection };