[![Build Status](https://semaphoreci.com/api/v1/projects/6b0be2a6-0da9-4a20-991a-7373628354d0/663555/badge.svg)](https://semaphoreci.com/shakdwipeea/cxla)

 [![npm version](https://badge.fury.io/js/cxla.svg)](https://badge.fury.io/js/cxla)
 [![npm downloads](https://img.shields.io/npm/dt/cxla.svg)](https://npmjs.org/package/cxla)

# CXLA
:tada::boom::sparkles: Generic Log Analyzer



###Prerequisites

1. nodejs
2. git 

----------

###Installing Nodejs
  * For 64-bit 
```shell
wget https://nodejs.org/dist/v5.9.0/node-v5.9.0-linux-x64.tar.xz
tar -xvf node-v5.9.0-linux-x64.tar.xz
cd node-v5.9.0-linux-x64/
```
  * For 32-bit
```shell
wget https://nodejs.org/dist/v4.4.0/node-v4.4.0-linux-x86.tar.xz
tar -xvf node-v4.4.0-linux-x86.tar.xz
cd node-v4.4.0-linux-x86/
```
  * Depending upon the architecture follow the below steps:

Add node-v5.9.0-linux-x64/bin to the system path.

1.Open ~/.bashrc in your editor

2.Type in
```export PATH=$PATH:/path/to/your/directory/node-v5.9.0-linux-x64/bin  ```
3.Finally after saving the file

In terminal type
```sh
source ~/.bashrc
```



###Installation

* ``` git clone https://github.com/shakdwipeea/CXLA.git```

* Move to the directory CXLA
```sh
cd CXLA/
```

* Install web dependencies
```sh
npm install -g bower
cd public/
bower install
```

* Go to project directory
```
cd ../
npm install
npm install -g pm2
pm2 start bin/www
```
OR
```
cd ../
npm install -g nodemon
nodemon
```
OR

```
cd ../
node ./bin/www
```
* Now visit ```localhost:8080```


------------

###Working
1. Upload the log file

2. For using the search feature just enter the term you want to search and press enter.

3. For using the highlight feature

  * first highlight the key then press next.

  * second time highlight the value corresponding to it and then press next.
  
  * In the table of key,name,value enter the name of attribute you want to plot in the input field for example:
  
Snapshot 1:
![alt-text](https://github.com/shakdwipeea/CXLA/blob/master/public/images/Screen%20Shot%202016-03-18%20at%206.12.28%20PM.png)


> For highlighting the value utmost care should be taken that there must be characters followed by the value you want.for example:

Snapshot 2:
![alt-text](https://github.com/shakdwipeea/CXLA/blob/master/public/images/Screen%20Shot%202016-01-25%20at%209.43.14%20AM.png)

> consider the highlighted line different key value pairs can be:

1. key: S(100.100.12.10:80: value: Hits(10.89,
2. key: S(100.100.12.10:80: value: Hits(10.89, 0
3. key: S(100.100.12.10:80: value: P[40,
4. key: S(100.100.12.10.80: value: P[40, 0
5. key: S(100.100.12.10.80: value: Mbps(0.00)
and so on


Snapshot 3:
![alt-text](https://github.com/shakdwipeea/CXLA/blob/master/public/images/Screen%20Shot%202016-01-25%20at%209.50.29%20AM.png)

> consider the highlighted line different key value pairs can be:

1. key: EVENT MONITORDOWN value: MONITORDOWN 72409
2. key: EVENT MONITORDOWN value: MONITORDOWN 72409 0
3. key: GMT value: MONITORDOWN 72409 0
4. key: GMT value:GMT NS_123 0-PPE-0  and so on
