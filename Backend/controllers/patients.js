const db = require("../db/dbcon");

const find = async (req, res) => {
  try {
    const { Id, Name, Last } = req.query;
    let query = ``;

    if (!Id && !Name && !Last) {
      query = `SELECT * FROM patients`;
    } else {
      if (Id) {
        query = `SELECT * FROM patients WHERE ID LIKE '${Id}%'`;
      }
      if (Name) {
        query = `SELECT * FROM patients WHERE First LIKE '${Name}%'`;
      }
      if (Last) {
        query = `SELECT * FROM patients WHERE Last LIKE '${Last}%'`;
      }
    }

    const data = await db.query({ query });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400).send(`error 400`);
  }
};

module.exports = {
  find,
};
