angular.module('quickFixModule.quickFixController', ['ngFileSaver']).
controller('quickFixCtl',  function($scope, $rootScope, $timeout ,quickFixCommonService, FileSaver, Blob) {

    var requestLimit = 500;
    var statusWait = 3000;

    var destTags;
    var destTagList;
    var loadedTagList;
    var $ddEnvironmentFilterSearch = $("#ddEnvironmentFilterSearch");
    var quickFixTables;
    var quickFixTableColumns;
    var quickFixTargetFileContent = "";
    var exportFileName;
    var exportID;
    var fileReady;
    var toLocalizeHeaders = [];
    var keyHeaders = [];

    $scope.filters = [];
    $scope.filefilters = [];
    $scope.selectedEnvironment;
    $scope.quickFixTable;
    $scope.quickFixTargetFileContent;


    /*
     * initiate Environment
     */
    $scope.initEnvironment = function() {

        $scope.selectedEnvironment = "CarsInventory";
        $scope.retrieveTables();
    };

    /**
     *  retrived Tables
     */

    $scope.retrieveTables = function() {

        var quickFixDB =  $scope.selectedEnvironment;
        console.log("QuickFix Controller RetrieveTables ...............................");
        var quickFixRequest = quickFixCommonService.getTables(quickFixDB);
        console.log("quickFixRequest" + JSON.stringify(quickFixRequest));


        quickFixRequest.success(function (tables) {
            var tablesList = {"Current": []};
            angular.forEach(tables, function (table) {
                tablesList.Current.push({
                    "value": table.TableName
                });
            });
            $scope.quickFixTables = tablesList;
            $scope.filters.push({
                "name": "Table",
                "icon": "bookmark",
                "options": $scope.quickFixTables,
                "value": ""
            });
        });
    };

    /**
     *  Retrieve Columns
     */
    $scope.retrieveTableColumns = function(){

        $scope.name = null;
        var quickFixDB = document.getElementById('ddEnvironmentFileSearch_file').value;
        var quickFixTable = document.getElementById('select-quickFixTables').value;
        $scope.quickFixTable = document.getElementById('select-quickFixTables').value;

        console.log("quickFixTable" + quickFixTable);

        var quickFixRequestTableColumns =  quickFixCommonService.getColumns(quickFixDB, quickFixTable);
        console.log("QuickFix Controller RetrieveTable Columns ...............................");
        quickFixRequestTableColumns.success(function(responseTableColumns){
            expectedColumnsNames = {"expectedHeaders": []};
            angular.forEach(responseTableColumns, function (responseTableColumn) {
                expectedColumnsNames.expectedHeaders.push({
                    "tableName": responseTableColumn.LocTableExportColumnName,
                    "tableName": responseTableColumn.LocTableExportColumnName,
                    "tableId": responseTableColumn.LocTableExportColumnId,
                    "tableTypeId": responseTableColumn.LocTableExportColumnTypeId,
                    "headerIndex": 0
                });
            });
            quickFixTableColumns = expectedColumnsNames;
            $scope.quickFixTableColumns = expectedColumnsNames;

            console.log("$scope.quickFixTableColumns", + $scope.quickFixTableColumns);

        })
        quickFixRequestTableColumns.error(function(responseTableColumns){
            console.log("Error:" + JSON.stringify(responseTableColumns));
        })
    }


    /**
     *  Begin the file export
     */
    $scope.beginExportFromFile = function() {
        if (quickFixTargetFileContent !=="") {

            document.getElementById("export_id").setAttribute("class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
            downloadFile(FileSaver, Blob);
        } else {
            $scope.errMessage = "Generated file is empty! Nothing to Import!"
            resetElements();
        }
    };

    /**
     * Parse file contents and get the distinct Destination IDs and their tags
     * @param $fileContent
     */

    $scope.parseFileContent = function($fileContent) {


        var lines, data, destId, tagName, numDestinations = 0;
        lines = $fileContent.split('\n');
        for (var i = 0; i < lines.length; i++) {
            l = lines[i];
            data = l.split('\t');

            if (i == 0) {
                if (!isTSVFormatValidate(lines)) {
                    $scope.errMessage = "Invalid TSV file Format!";
                    $scope.fileName = null;
                    setTimeout(refreshContent,2000);

                    break;
                }
                if (!isTSVHeaderValidate(l.trim().split('\t'))) {
                    $scope.errMessage = "Invalid Header in data file!";
                    $scope.fileName = null;
                    setTimeout(refreshContent,2000);
                    break;
                } else {
                    $scope.errMessage = null;
                    $scope.fileName = data[0];
                }
            } else {
                processTSVFile(l.trim().split('\t'));
            }
        }

        if ($scope.errMessage == null) {
            generateFileName($scope.selectedEnvironment, $scope.quickFixTable);
            $scope.exportFileName = exportFileName;
        }
    };

    function refreshContent(){
        location.reload();
    }

   /**
     * @returns the selected environment
     */
    function getEnvironment() {
        return $ddEnvironmentFilterSearch.selectpicker('val');
    }

     /**
      *  @returns  boolean (True or False) if headers are valid
      */
    function isTSVHeaderValidate(headers){

            var flag = true;
            var isPresentOptionalColumn = false;
            var expectedHeaders = $scope.quickFixTableColumns.expectedHeaders;

            console.log("$scope.quickFixTableColumns" + JSON.stringify($scope.quickFixTableColumns));


            for(var i=0; i<expectedHeaders.length; i++ ){
                 if( expectedHeaders[i].tableTypeId == 1 && headers.indexOf(expectedHeaders[i].tableName) < 0){
                    console.log("Missing Header in the file: -- " + expectedHeaders[i].tableName);
                    flag = false;
                    break;
                 }
                 else{
                       if(expectedHeaders[i].tableTypeId == 2 && headers.indexOf(expectedHeaders[i].tableName)  >= 0){
                            isPresentOptionalColumn = true
                            }
                       $scope.quickFixTableColumns.expectedHeaders[i].headerIndex = headers.indexOf(expectedHeaders[i].tableName) - 1;
                 }
              }
             organizeHeadersByTypeId();
             return (flag && isPresentOptionalColumn) ? true : false;
    }

    /**
    *  @returns  boolean (True or False) if TSV format is are valid
    */
    function isTSVFormatValidate(fileLines){

            var flag = true;
            var headersCount = fileLines[0].split('\t').length - 1;
            for(var i = 1; i < fileLines.length; i++){
                if(headersCount != fileLines[i].split('\t').length || headersCount == 1){
                    flag = false;
                    break;
                    }
                }
                return flag;
    }

    function processTSVFile(line){

            console.log("--------- processTSVFile ----------");
                var expectedHeaders = $scope.quickFixTableColumns.expectedHeaders;
                var beginningLineText = "1-Insert new content (non-exported): ";
                var finalLine = null;

                console.log("expected Headers:" + JSON.stringify(expectedHeaders));
                console.log("*******************toLocalizeHeaders.length:" + toLocalizeHeaders.length);

                for (var i =0 ; i<toLocalizeHeaders.length; i++){
                    var tableColumnId = toLocalizeHeaders[i].tableId;
                    var tableColumnValue = line[toLocalizeHeaders[i].headerIndex];

                    console.log("*******************tableColumnValue:" + tableColumnValue);


                    if (line[toLocalizeHeaders[i].headerIndex] !== undefined &&
                                                         line[toLocalizeHeaders[i].headerIndex] != null &&
                                                         line[toLocalizeHeaders[i].headerIndex] != ""){
//TODO
                          finalLine = beginningLineText;
                          finalLine = finalLine.concat(tableColumnId);
                          finalLine = finalLine.concat("=");
                          finalLine = finalLine.concat(tableColumnValue);
                          finalLine = finalLine.concat("|");

                    }else{
                        continue;
                        console.log("CONTINUE:" + is)
                    }

                    for (var k =0 ; k<keyHeaders.length; k++){
                        var keyTableColumnId = keyHeaders[k].tableId;
                        var keyTableColumnValue = line[keyHeaders[k].headerIndex];
                        if (line[keyHeaders[k].headerIndex] != undefined &&
                                                line[keyHeaders[k].headerIndex] != null &&
                                                line[keyHeaders[k].headerIndex] != ""){

                                      finalLine = finalLine.concat(keyTableColumnId);
                                      finalLine = finalLine.concat("=");
                                      finalLine = finalLine.concat(keyTableColumnValue) ;
                        }else{
                            break;
                        }

                        if(k != keyHeaders.length - 1){
                             finalLine = finalLine.concat("|");
                        }

                    }
                    if(finalLine !=null){
                                            quickFixTargetFileContent = quickFixTargetFileContent.concat(finalLine);
                                            quickFixTargetFileContent = quickFixTargetFileContent.concat("\r\n");
                                            $scope.quickFixTargetFileContent = quickFixTargetFileContent;

                    }
                    console.log("FINAAL:" + finalLine + "\r\n");

                }



    }

    function organizeHeadersByTypeId(){
         var expectedHeaders = $scope.quickFixTableColumns.expectedHeaders;

        for(var i=0; i<expectedHeaders.length; i++ ){
            if( expectedHeaders[i].tableTypeId == 1){
                            keyHeaders.push(expectedHeaders[i]);
                    }
            if( expectedHeaders[i].tableTypeId == 2){
                    toLocalizeHeaders.push(expectedHeaders[i]);
            }
        }

        console.log("toLocalizeHeaders --------> " + JSON.stringify(toLocalizeHeaders));
        console.log("keyHeaders --------> " + JSON.stringify(keyHeaders));
    }

    function getKeyHeaders(){
    }

    function downloadFile(FileSaver, Blob){

        var bomString = '\ufeff';
        quickFixTargetFileContent = bomString.concat(quickFixTargetFileContent);
        var encoder = new TextEncoder("UTF-16LE")
        var data = new Blob([encoder.encode(quickFixTargetFileContent)], { type: 'text/plain' })
        FileSaver.saveAs(data, $scope.exportFileName);
        $.growl('<span class="glyphicon glyphicon-success-sign"></span> <b>' + $scope.exportFileName + ':</b>  Successfully Downloaded', {
            type: 'success',
            delay: 20000
        });

        $scope.fileName = null;
        $scope.exportFileName = null;
        $scope.errMessage = null;
        setTimeout(refreshContent,2000);


    }

    function generateFileName(dbName, tableName){

            var targetfFileName = "QF_";
            targetfFileName = targetfFileName.concat(dbName);
            targetfFileName = targetfFileName.concat("_");
            targetfFileName = targetfFileName.concat(tableName);
            targetfFileName = targetfFileName.concat(".dat");
            console.log("TargetFileName:" + targetfFileName);
            exportFileName = targetfFileName;
    }

    function resetElements(){
            console.log("$scope.fileName " + $scope.fileName );
            console.log("$scope.exportFileName " + $scope.exportFileName );
            console.log("$scope.errMessage " + $scope.errMessage );
            console.log("quickFixTargetFileContent " + quickFixTargetFileContent );
            $scope.fileName = null;
            $scope.exportFileName = null;
            $scope.errMessage = null;
            quickFixTargetFileContent = "";

    }

});

// Initialize plugins on load
$(document).ready(function() {
    $('.selectpicker').selectpicker();
});




