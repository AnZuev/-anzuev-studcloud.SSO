# SSO package for StudCloud project

Основная документация - http://docs.idevteam.ru/display/PD/2.0.x+API+description
StudCloud.SSO - пакет, который упрощает операции, связанные с авторизацией клиентов.  
Всю работу с cookie и сессиями можно поручить пакету.  
Для каждого запроса создается контекст:  
    1. уровень авторизации(0-4):  
       <ul>
            <li> 0 - unauthorized</li>
            <li> 1 - authorized</li>
    	    <li> 2 - mail submitted</li>
   		    <li> 3 - mobile submitted</li>
   		    <li> 4 - document submitted</li>
   	    </ul>
   	2. объект user
   	    <ul>
                <li> user - authLevel > 0</li>
                <li> undefined - authLevel == 0 </li>
       	</ul>
   	
Также с помощью него можно проверить уровень авторизации:  
    1. authLevel >= required - пропускаем дальше  
    2. authLevel < required - ошибка(401 или 405)  
    

## Installation

npm install @anzuev/studcloud.sso --save


## Usage


```js
let SSO = require('sso');


//...koa.js app
//before use make sure that mongoose.UsersUri, mongoose.PSSUri and mongoose.SSOUri setted in config
SSO.init();
	
//basic work withSession, now it is koa-generic-session middleware
app.use(SSO.getSessionsMiddleware(config.get('sso:session'))));
    
//load user context
app.use(SSO.getContextMiddleware());

//... koa.js app



```



## History
1.4.0 - unstable version for express app  
2.0.0 - unstable version for koa.js  
2.0.4 - unstable version for koa.js
