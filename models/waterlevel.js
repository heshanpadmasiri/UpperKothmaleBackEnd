const sql = require('mssql/msnodesqlv8')

const pool = new sql.ConnectionPool({
  database: 'UkhpDB',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});

function __rainfall_query(number_of_units,table,callback){
  pool.request().query(`SELECT TOP (${number_of_units * 12}) * FROM ${table}`).then((err,result) => {
    if(err){
      console.error(err);
      return callback(err,null);
    } else {
      console.log(result);
      return callback(null,result);
    }
  });
}

function rainfall_query(number_of_units, table,callback){
  var stations = [];  
  var response = {}; 
  var stationIDs = [51,52,53,54,55,56]
  for (let index = 0; index < stationIDs.length; index++) {
    const id = stationIDs[index];
    stations.push({
      station_id:id,
      station_name: `${id}`
    });
  }
  count = 0;
  stations.forEach(station => {
    console.log(station)
    pool.request().query(`SELECT TOP(${number_of_units}) wld_TotFV FROM ${table} WHERE wld_sm_id = ${station.station_id}`).then((r,e)=>{
      count ++;
      if(e){
        console.error(e);
        return callback(e,null);
      } else {
        var temp = {
          station_name: station.station_name,
          rainfall:r.recordset,
          station_id: station.station_id
        }
        const id = station.station_id;
        response[id] = temp;          
      } 
      if(count == stations.length){
        console.log(response);
        callback(null, response);
      }
    });  
  })
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