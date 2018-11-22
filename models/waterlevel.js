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

function rainfall_query(number_of_units, table,column_name,time_column,callback){
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
    const query = `SELECT TOP(${number_of_units}) wl${column_name}_WL, ${time_column} FROM ${table} WHERE wl${column_name}_sm_id = ${station.station_id}`;
    pool.request().query(query).then((r,e)=>{
      count ++;
      if(e){
        console.error(e);
        return callback(e,null);
      } else {
        let waterLevel = [];
          for (let index = 0; index < r.recordset.length; index++) {
            const element = r.recordset[index];
            const marker = element[`${time_column}`]
            let x;
            const date =  marker.getDate();
            const month = marker.getMonth() + 1;
            const hour = marker.getHours();
            const marker_text = `${date}/${month} - ${hour}:00`;
            switch (column_name) {
              case 'd':
                x = date;
                break;
              case 'm':
                x = month;
                break;
              case 'h':
                x = hour;
                break;
              default:
                break;
            }      
            const data = {
              y:element[`wl${column_name}_WL`],
              x:x,
              marker:marker_text,              
              timeStamp:marker
            }
            waterLevel.push(data)
          }
        var temp = {
          station_name: station.station_name,
          rainfall:waterLevel,
          station_id: station.station_id
        }
        const id = station.station_id;
        response[id] = temp;          
      } 
      if(count == stations.length){
        return callback(null, response);
      }
    }).catch(err => {
      return callback(err,null)
    });  
  })
}

module.exports.get_data = (number_of_units,unit_type,callback) => {    
    if(unit_type === 'day'){
      var table = 'dbo.tbl_water_level_d';
      var column_name = 'd';      
      var time_column = 'wld_day';
    } else if (unit_type === 'month'){
      var table = 'dbo.tbl_water_level_m';
      var column_name = 'm';      
      var time_column = 'wlm_day';
    } else if (unit_type === 'hour'){
      var table = 'dbo.tbl_water_level_hr';
      var column_name = 'h';
      var time_column = 'wlh_time';
    }
    if(pool.connected){
      return rainfall_query(number_of_units,table,column_name,time_column,callback);
    } else {
        pool.connect().then(() => {
            return rainfall_query(number_of_units,table,column_name,time_column,callback);
        });
    }
}