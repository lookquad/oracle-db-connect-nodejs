process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

async function run() {
  let connection;

  try {

    let sql, binds, options, result;

    connection = await oracledb.getConnection(dbConfig);  //create connection with db

    //
    // Create a table
    //

    const stmts = [
      `DROP TABLE phisense`,

      `CREATE TABLE phisense (id VARCHAR2(20), name VARCHAR2(20), speed VARCHAR2(20))`
    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch(e) {
        if (e.errorNum != 942)
          console.error(e);
      }
    }

    //
    // Insert three rows
    //

    sql = `INSERT INTO phisense VALUES (:1, :2, :3)`;

    binds = [
      ["P_101", "Pump One", "256 RPM" ],
      ["P_102", "Pump Two", "125 RPM" ],
      ["P_103", "Pump Three", "0 RPM" ]
    ];

    // For a complete list of options see the documentation.
    options = {
      autoCommit: true,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        { type: oracledb.STRING, maxSize: 20 },
        { type: oracledb.STRING, maxSize: 20 },
        { type: oracledb.STRING, maxSize: 20 }
      ]
    };

    result = await connection.executeMany(sql, binds, options);

    console.log("Number of rows inserted:", result.rowsAffected);

    //
    // Query the data
    //

    
    sql = `SELECT * FROM phisense`;

    binds = {};

    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };

    result = await connection.execute(sql, binds, options);

    console.log("Metadata: ");
    console.dir(result.metaData, { depth: null });
    console.log("Query results: ");
    console.dir(result.rows, { depth: null });

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();