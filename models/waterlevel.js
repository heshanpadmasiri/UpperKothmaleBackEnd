const sql = require('mssql/msnodesqlv8')

const pool = new sql.ConnectionPool({
  database: 'UkhpDB',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});

function rainfall_query(number_of_units,table,callback){
  pool.request().query(`SELECT TOP (${number_of_units * 6}) * FROM ${table}`).then((err,result) => {
    if(err){
      console.error(err);
      return callback(err,null);
    } else {
      console.log(result);
      return callback(null,result);
    }
  });
}

module.exports.get_data = (number_of_units,unit_type,callback) => {    
    if(unit_type === 'day'){
      var table = 'dbo.tbl_water_level_d';
    } else if (unit_type === 'month'){
      var table = 'dbo.tbl_water_level_m';
    } else if (unit_type === 'hour'){
      var table = 'dbo.tbl_water_level_hr';
    }
    if(pool.connected){
        return rainfall_query(number_of_units,table,callback);
    } else {
        pool.connect().then(() => {
            return rainfall_query(number_of_units,table,callback);
        });
    }
}