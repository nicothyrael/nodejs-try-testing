var sql = require('mssql');
var config = require('../config/config');
var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 550, checkperiod: 600 } );
var locQuickFixDBClient = config.locQuickFix;


const SELECT_TABLE_NAMES = "Select  LocMainTableName as  TableName  from dbo.LocMainTable t "
                         +"join dbo.LocTableExport xt on t.LocMainTableId = xt.LocMainTableId "
                         +"join dbo.SQLServerDatabase d on d.SQLServerDatabaseId = t.SQLServerDatabaseId "
                         +"where DatabaseName = ";

const SELECT_LOC_EXPORT_COLUMN_NAME = "select  xc.LocTableExportColumnName, LocTableExportColumnId, LocTableExportColumnTypeId from dbo.LocMainTable t "
                                       + "join dbo.LocTableExport xt on t.LocMainTableId = xt.LocMainTableId join dbo.LocTableExportColumn xc "
                                       + "on xc.LocTableExportId = xt.LocTableExportId join dbo.SQLServerDatabase d "
                                       + "on d.SQLServerDatabaseId = t.SQLServerDatabaseId "
                                       + "where DatabaseName = ";
//                                       + "where DatabaseName = 'CarsInventory' and LocMainTableName = 'CarCategoryLoc' and LocTableExportColumnName <> 'UpdateDate'"

module.exports = {
    getTables: function (environment, callback) {

        console.log("Dao get Table Service....");
        var SELECT_TABLE_NAMES_ENV = SELECT_TABLE_NAMES+ "'"+environment+"'"
        console.log(SELECT_TABLE_NAMES_ENV);
        var envClient =    locQuickFixDBClient;
        var connection = new sql.Connection(envClient, function (err) {
            if (err) {
                console.log("---> Error ");
                console.log(err);
            } else {
                var request = new sql.Request(connection);
                request.query(SELECT_TABLE_NAMES_ENV, function (err, recordset) {
                    callback(recordset);
                });
            }
        });
    },

    getTableColumns: function (environment, tableName, callback) {

                       console.log("Dao get Tables Columns Service...");
                       var SELECT_LOC_EXPORT_COLUMN_NAME_REQ = SELECT_LOC_EXPORT_COLUMN_NAME + "'" +environment+ "'"
                                                                + " and LocMainTableName = '" + tableName + "' "
                                                                + "and LocTableExportColumnName <> 'UpdateDate'";

                       console.log(SELECT_LOC_EXPORT_COLUMN_NAME_REQ);
                       var envClient =    locQuickFixDBClient;
                       var connection = new sql.Connection(envClient, function (err) {
                           if (err) {
                               console.log("---> Error ");
                               console.log(err);
                           } else {
                               var request = new sql.Request(connection);
                               request.query(SELECT_LOC_EXPORT_COLUMN_NAME_REQ, function (err, recordset) {
                               console.log("Dao Service....getTableColumns: "+ JSON.stringify(recordset));
                                   callback(recordset);
                               });
                           }
                       });
                   },
}


function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
