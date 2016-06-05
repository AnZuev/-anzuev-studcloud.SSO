# SSO package for StudCloud project

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
   	3. changePasswordToken:
   	     <ul>
                <li> string - allow to change password(value is key)</li>
                <li>  undefined - not allow to change password  </li>
         </ul>
Также с помощью него можно проверить уровень авторизации:  
    1. authLevel >= required - пропускаем дальше  
    2. authLevel < required - ошибка(401 или 405)  
    

## Installation

npm install @anzuev/studcloud.sso --save


## Usage


```js
let SSO = require('sso');


//...express app
    let configuration = {
	    auth:{
            host: '127.0.0.1',
            port: 27017,
            db: "test_sso"
	    }
	};
	//before use
	SSO.init(configuration);
	
	//basic work withSession, now it is express-session middleware
    app.use(SSO.getSessionsMiddleware());
    
    //load user context
    app.use(SSO.getContextMiddleware());

//... express app


//... routes file
    router.get('/', SSO.checkAuthMiddleware, function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
    /*
    available checks:
        - checkAuthMiddleware
        - checkMailActivationMiddleware
        - checkMobileActivationMiddleware
        - checkDocumentActivationMiddleware
    */
//... routes file
```





## History

This is first version(1.0.0)
