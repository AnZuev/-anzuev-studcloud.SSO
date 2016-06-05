# SSO package for StudCloud project

StudCloud.SSO - пакет, который упрощает операции, связанные с авторизацией клиентов.__
Всю работу с cookie и сессиями можно поручить пакету.__
Для каждого запроса создается контекст:__
    * уровень авторизации(0-4):__
        * 0 - unauthorized
        * 1 - authorized
    	* 2 - mail submitted
   		* 3 - mobile submitted
   		* 4 - document submitted,
   	* объект user
        * user - authLevel > 0
        * undefined - authLevel == 0
   	* changePasswordToken:
    	* string - allow to change password(value is key)
    	* undefined - not allow to change password__
    	
Также с помощью него можно проверить уровень авторизации:
    - authLevel >= required - пропускаем дальше
    - authLevel < required - ошибка(401 или 405)
    

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
