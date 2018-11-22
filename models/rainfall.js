const sql = require('mssql/msnodesqlv8')

const pool = new sql.ConnectionPool({
  database: 'UkhpDB',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});


function rainfall_query(number_of_units, table,column_name,time_column,callback){
  var stations = [];  
  var response = {}; 
  pool.request().query('SELECT sm_id, sm_station_name,sm_type FROM dbo.tbl_station_master').then((result,err)=>{
    if(err){
      console.error(err);
      return callback(err,null);
    } else {
      result.recordset.forEach(record => {
        const station_name = record.sm_station_name;
        const station_id = record.sm_id;
        const station_type = record.sm_type;
        if(station_type == 1){
          var d = {
            station_id:station_id,
            station_name:station_name
          }
          stations.push(d);
        }
      });
      
    }
  }).then(() => {
    count = 0;
    stations.forEach(station => {
     
      pool.request().query(`SELECT TOP(${number_of_units}) rf${column_name}_crfValue, ${time_column} FROM ${table} WHERE rf${column_name}_sm_id = ${station.station_id}`).then((r,e)=>{
        count ++;
        if(e){
          console.error(e);
          return callback(e,null);
        } else {
          let rainFall = [];
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
              y:element[`rf${column_name}_crfValue`],
              x:x,
              marker:marker_text,
              timeStamp:marker
            }
            rainFall.push(data)
          }
          var temp = {
            station_name: station.station_name,
            rainfall:rainFall,
            station_id: station.station_id
          }
          const id = station.station_id;
          response[id] = temp;          
        } 
        if(count == stations.length){
          callback(null, response);
        }
      });  
    });
    
  }).catch(er => {
    console.error(er);
    callback(er,null);
  })
  
}

module.exports.get_data = (number_of_units,unit_type,callback) => {    
    if(unit_type === 'day'){
      var table = 'dbo.tbl_rain_fall_d';
      var column_name = 'd';
      var time_column = 'rfd_date';
    } else if (unit_type === 'month'){
      var table = 'dbo.tbl_rain_fall_m';
      var column_name = 'm';
      var time_column = 'rfm_date';
    } else if (unit_type === 'hour'){
      var table = 'dbo.tbl_rain_fall_hr';
      var column_name = 'h';
      var time_column = 'rfh_time';
    }
    if(pool.connected){
        return rainfall_query(number_of_units,table,column_name,time_column,callback);
    } else {
        pool.connect().then(() => {
            return rainfall_query(number_of_units,table,column_name,time_column,callback);
        });
    }
}