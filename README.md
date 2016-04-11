# QuickFix: datastaging-web
Replace the existing DataStaging  export tool based on excel spreadsheet  by using a new primer web based applicatio



### UseCase
  * Select Database
  * Select Table : the list of tables get refreshed relatively to the database selection
  * Browse and Upload the TSV Format File: validates TSV file format and file headers according to the selected table
  * Generate and export .DAT file: ready to import into DB

### HowTo: generate a valid TSV file
1. Retrive data by Execute SQL queries for "Carsinventory" DB
    ```
        /*
            Connect to CarsInventory database
        */

        declare @Language table (LangId smallint)
        --Add any language that we need to export
        insert into @Language values (1036),(1031)


        select t1.CarMediaID, t2.CarFeatureInfo As CarFeatureInfo1033, t1.CarFeatureInfo As CarFeatureInfo, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarMediaDataLoc t1
        join  dbo.CarMediaDataLoc t2 on t1.CarMediaID = t2.CarMediaID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId

        select t1.CarCategoryID, t2.CarCategoryName As CarCategoryName1033, t1.CarCategoryName As CarCategoryName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarCategoryLoc t1
        join  dbo.CarCategoryLoc t2 on t1.CarCategoryID = t2.CarCategoryID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId


        select t1.CarTypeID, t2.CarTypeName As CarTypeName1033, t1.CarTypeName As CarTypeName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarTypeLoc t1
        join  dbo.CarTypeLoc t2 on t1.CarTypeID = t2.CarTypeID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId

        select t1.CarTransmissionDriveID, t2.CarTransmissionDriveName As CarTransmissionDriveName1033, t1.CarTransmissionDriveName As CarTransmissionDriveName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarTransmissionDriveLoc t1
        join  dbo.CarTransmissionDriveLoc t2 on t1.CarTransmissionDriveID = t2.CarTransmissionDriveID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId

        select t1.CarFuelAirConditionID, t2.CarFuelAirConditionName As CarFuelAirConditionName1033, t1.CarFuelAirConditionName As CarFuelAirConditionName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarFuelAirConditionLoc t1
        join dbo.CarFuelAirConditionLoc t2 on t1.CarFuelAirConditionID = t2.CarFuelAirConditionID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId

        select t1.CarLocationCategoryID, t2.CarLocationCategoryName As CarLocationCategoryName1033, t1.CarLocationCategoryName As CarLocationCategoryName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarLocationCategoryLoc t1
        join dbo.CarLocationCategoryLoc t2 on t1.CarLocationCategoryID = t2.CarLocationCategoryID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId

        select t1.CarSpecialEquipmentID, t2.CarSpecialEquipmentName As CarSpecialEquipmentName1033, t1.CarSpecialEquipmentName As CarSpecialEquipmentName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarSpecialEquipmentLoc t1
        join dbo.CarSpecialEquipmentLoc t2 on t1.CarSpecialEquipmentID = t2.CarSpecialEquipmentID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId


        select t1.CarClassificationID, t2.CarClassificationDisplayName As CarClassificationDisplayName1033, t1.CarClassificationDisplayName As CarClassificationDisplayName, t1.LangIdAs LocalizeLangId ,
            t2.UpdateDate  as UpdateDate1033,  t1.UpdateDate  as UpdateDateTarget
        from dbo.CarClassificationLoc t1
        join dbo.CarClassificationLoc t2 on t1.CarClassificationID = t2.CarClassificationID and t2.LangId= 1033
        join @Language l on l.LangId= t1.LangId
   ```
2. Select-all each result set copy with headers
3. Save as .TSV file

### How: QuickFix validates headers
1. For selected table it retrieve list of columns which should be present in the TSV file header
    ```
    select  xc.LocTableExportColumnName, LocTableExportColumnId, LocTableExportColumnTypeId from dbo.LocMainTable t
    join dbo.LocTableExport xt on t.LocMainTableId = xt.LocMainTableId join dbo.LocTableExportColumn xc
    on xc.LocTableExportId = xt.LocTableExportId join dbo.SQLServerDatabase d
    on d.SQLServerDatabaseId = t.SQLServerDatabaseId
    where DatabaseName = 'CarsInventory' and LocMainTableName = <TABLE_NAME> and LocTableExportColumnName <> 'UpdateDate'
    ```
2. Validates that all mandatory Headers, which have LocTableExportColumnTypeId==1, are present in the uploaded file
3. Validates that at least one optional Header, which has LocTableExportColumnTypeId==2, is present in the uploaded file

### How: QuickFix generate .DAT file
1. For every line in the TSV file QuickFix will generate one or more lines in DAT file (based on how many columns/headerNamse are present where LocTableExportColumnTypeId == 2)
2. Every DAT Line starts with "1-Insert new content (non-exported): "
3. Every HeaderName is replaced with ColumnId retrieved from the previous SQL query where LocTableExportColumnName associated with LocTableExportColumnTypeId
4. First ColumnId=Value in the line is the Value which should be localized, and followed by columns which are Keys in DB (LocTableExportColumnTypeId == 1)

### Example
1. TSV File
    ```
    CarCategoryID	CarCategoryName1033	CarCategoryName	LocalizeLangId	UpdateDate1033	UpdateDateTarget
    0	No Preference	No Preference	1036	2016-03-16 12:52:00	2016-03-16 12:14:00
    1	Mini	Mini	1036	2016-03-16 12:52:00	2016-03-16 12:07:00
    ```

2. TableColumns retrieved from DB
    ```
    [
       {
          "LocTableExportColumnName":"CarCategoryID",
          "LocTableExportColumnId":830,
          "LocTableExportColumnTypeId":1
       },
       {
          "LocTableExportColumnName":"LocalizeLangId",
          "LocTableExportColumnId":831,
          "LocTableExportColumnTypeId":1
       },
       {
          "LocTableExportColumnName":"CarCategoryName",
          "LocTableExportColumnId":832,
          "LocTableExportColumnTypeId":2
       }
    ]
    ```

2. DAT File
    ```
    1-Insert new content (non-exported): 832=No Preference|830=0|831=1036
    1-Insert new content (non-exported): 832=Mini|830=1|831=1036
    ```

================================================================================================

#### App's pre-requisites

Ensure you have `node` and `npm` installed.


#### Running the application

To run the app in dev environment, execute

```
$ ./bin/www
```

or

```
$ node server.js
```

Command above will launch express in cluster mode if your development machine has more than 1 cpu/core. If you want to run in non-cluster mode, use the following commands

```
$ ./bin/www --standalone
```

or

```
$ node server.js --standalone
```

To start the app in any other environment, set NODE_ENV environment valiable to one of ```test```, ```int``` or ```prod```

#### Files

##### build.sh

```build.sh``` file will be used for bundling the application when the build runs. Prime build-deploy pipeline expects a versioned artifact to be deployed on the servers, which is produced by this script. Make changes to the script to include all files that needs to be deployed on the server.

##### install.sh

```install.sh``` file will be executed on the server to setup the project. For example, running ```npm install``` or ```bower install``` should be done here. E3 prime will make sure the instance that runs a node app has ```node, npm and bower```. 



#### [EXPERIMENTAL] DOCKER

##### Docker Prerequisites

For OS X setup instructions, see: [https://ewegithub.sb.karmalab.net/EWE/docker](https://ewegithub.sb.karmalab.net/EWE/docker)

##### How to build with Docker?

```
./build.sh
```

```
docker build -t localization-quickfix-web .
```

##### How to run with Docker?

```
docker run -e "APP_NAME=localization-quickfix-web" -e "EXPEDIA_ENVIRONMENT=dev" -e "ACTIVE_VERSION=$(git rev-parse HEAD)" -p 8080:8080 localization-quickfix-web
```

Open a browser and hit [http://LOCAL_DOCKER_IP:8080/](http://LOCAL_DOCKER_IP:8080/) (e.g. [http://192.168.99.100:8080](http://192.168.99.100:8080))

