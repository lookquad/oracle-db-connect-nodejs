module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "C##luk",
  
    password      : process.env.NODE_ORACLEDB_PASSWORD || "tiger",

    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1521/orcl",

    // externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };