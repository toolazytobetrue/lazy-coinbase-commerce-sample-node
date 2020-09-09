```
sudo apt-get install nginx
sudo /etc/init.d/nginx start
sudo /etc/init.d/nginx stop
sudo /etc/init.d/nginx restart

mongo
use lazyservices
db.createUser( { user: "lazyservices", pwd: "aC9sQ3415bPnq4sjz93QEBTR3EFVEb3G", roles: [ "dbOwner" ] } )
show dbs
show collections
db.dropDatabase()
````
