const sql = require('mssql/msnodesqlv8');

const pool = new sql.ConnectionPool({
  database: 'users',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});


function addUser(user,callback){
    const query = `INSERT INTO dbo.userInfo VALUES (N'${user.idNumber}',N'${user.firstName}',N'${user.middleName}',N'${user.surName}',N'${user.email}',N'${user.station}',N'${user.designation}',N'${user.gender}',N'${user.password}')`;
    pool.request().query(query).then((result,error)=>{
        if(error){
            console.log(error)
            return callback(error,null)
        } else {
            return callback(null, result);
        }
    })
}

function getPassword(email,callback){
    const query = `SELECT password FROM userInfo WHERE email='${email}';`
    console.log(query)
    pool.request().query(query).then((result,error)=>{
        if(error){
            console.log(error)
            return callback(error,null);
        } else {
            console.log(result)
            var password = result.recordset[0];
            if (password === undefined || password === null){
                
                password = {
                    password:null
                }
            }
            console.log(password)
            return callback(null,password)
        }
    })
}

module.exports.createUser = (req,callback) => {
    if(pool.connected){
        return addUser(req,callback);
    } else {
        pool.connect().then(() => {
            return addUser(req,callback)
        });
    }
}

module.exports.getPassword = (req,callback) => {
    if(pool.connected){
        return getPassword(req.email,callback);
    } else {
        pool.connect().then(() => {
            return getPassword(req.email,callback)
        });
    }
}