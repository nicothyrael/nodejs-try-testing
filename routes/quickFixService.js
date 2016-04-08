var express = require('express');
var router = express.Router();
var timeout = require('connect-timeout');
var async = require('async');

var quickFixDAO = require('../dao/quickFixDAO');

router.use(timeout(1000000));
router.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
    if (!req.timedout) next();
}

/**
 * Returns the list of Tags by environment
 */
router.get('/getTables', function(req, res) {

    console.log("QuickFix Backend Services get Tables.............");
    quickFixDAO.getTables(req.query.environment, function(recordset) {
        res.json(recordset);
    });
});

/**
 * Returns the list of Tags by environment
 */
router.get('/getTableColumns', function(req, res) {

    console.log("QuickFix Backend Services get TableColumns.............");
    quickFixDAO.getTableColumns(req.query.environment, req.query.table, function(recordset) {
        res.json(recordset);
    });
});


module.exports = router;
