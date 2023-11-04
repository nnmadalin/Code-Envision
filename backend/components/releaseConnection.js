const releaseConnection = async (req, res, next) => {
   const connection = res.locals.connection;

   if (connection) {
      connection.release();
   }

   next();
};

module.exports = releaseConnection;
