```
sudo apt-get install nginx
sudo /etc/init.d/nginx start
sudo /etc/init.d/nginx stop
sudo /etc/init.d/nginx restart

mongo
use bert
db.createUser( { user: "bert", pwd: "hassan123", roles: [ "dbOwner" ] } )
show dbs
show collections
db.dropDatabase()
````
