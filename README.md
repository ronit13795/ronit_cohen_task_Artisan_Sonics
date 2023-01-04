# ronit_cohen_task_Artisan_Sonics
backend and frontend task with interfacing to mysql

 1. git clone  https://github.com/ronit13795/ronit_cohen_task_Artisan_Sonics.git
 2. enter into backend : cd..\backend and run : npm i
 
 To initialize data in the database:
 details: {HOST=localhost,USER_NAME=root,DB_PASSWORD=1234,DB_NAME=test} ,you should have db name test ||
 if you want change detailes you can enter into .env file and change the defined data.
 
 3. enter into \backend\initialScript and run command : node .\script.js 
 (the script will read the xl file, will calculate AGE and GA, create name table "patients" and insert all data to mysql. 
 [****! if you work with MySQL 8 :
 AND an error occurred  please Execute the following query in MYSQL Workbench:
 
 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword'; 
 flush privileges;
 
 and then try run again script with node,it should work now:)!****]
 
 
 4. go to path ronit_cohen_task_Artisan_Sonics\frontend> and run command npm i
 
 5. run npm start in both pathes- (ronit_cohen_task_Artisan_Sonics\frontend> , ronit_cohen_task_Artisan_Sonics\backend>) :=> the server will run on port:3000, the angular app will run on port :4200
 
 

 
 
