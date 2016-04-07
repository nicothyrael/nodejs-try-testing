localization-quickfix-web
======================

Expressjs based Node web app sample


#### Pre-requisites

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

