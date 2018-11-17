const sql = require('mssql/msnodesqlv8');

const pool = new sql.ConnectionPool({
  database: 'UkhpDB',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});

function station_query(callback){
    var stations = [];    
    pool.request().query('SELECT sm_id, sm_station_name,waterlevel_float,rainfall,waterlevel_pressure,activate FROM dbo.tbl_station_master').then((result,err)=>{
        if(err){
          console.error(err);
          return callback(err,null);
        } else {
          result.recordset.forEach(record => {
            const station_name = record.sm_station_name;
            const station_id = record.sm_id;
            const rainFallStatus = record.rainfall;
            const waterLevelStatus = record.waterlevel_float;
            const waterLevelPressureStatus = record.waterlevel_pressure;
            const activateStatues = record.activate;
            var d = {
                station_id:station_id,
                station_name:station_name,
                rainFallStauts:rainFallStatus,
                waterLevelStatus:waterLevelStatus,
                waterLevelPressureStatus:waterLevelPressureStatus,
                activateStatues:activateStatues
            };
            stations.push(d);

          });
        }
    }).then(() => {
        var count = 0;
        stations.forEach(station => {
            pool.request().query(`SELECT TOP(1) rfh_rfValue FROM tbl_rain_fall_hr WHERE rfh_sm_id = ${station.station_id}`).then((r,e)=>{
                if(e){
                    console.log(e);
                    return callback(e,null);
                } else {
                    if(r.recordset.length !== 0){
                        station.rainfall = r.recordset[0].rfh_rfValue;
                    } else {
                        station.rainfall = 'Not available';
                    }
                }
            }).then(() => {
                pool.request().query(`SELECT TOP(1) wlh_WL FROM tbl_water_level_hr WHERE wlh_sm_id = ${station.station_id}`).then((r,e)=>{
                    if(e){
                        console.log(e);
                        return callback(e,null);
                    } else {
                        if(r.recordset.length !== 0){
                            station.waterLevel = r.recordset[0].wlh_WL;
                        } else {
                            station.waterLevel = 'Not available';
                        }
                    }
                }).then(()=>{
                    count++;
                    if(count === stations.length){
                        return callback(null,stations)
                    }
                }).catch(err => {
                    return callback(err,null);
                })
            }).catch(err => {
                return callback(err,null);
            });
        })
        
    }).catch(err => {
        console.log(err);
        callback(err, null);
    })
}

module.exports.get_data = (callback) => {    
    
    if(pool.connected){
        return station_query(callback)
    } else {
        pool.connect().then(() => {
            return station_query(callback)
        });
    }
}