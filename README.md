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


//...koa.js app
//before use make sure that mongoose.UsersUri, mongoose.PSSUri and mongoose.SSOUri setted in config
SSO.init();
	
//basic work withSession, now it is koa-generic-session middleware
app.use(SSO.getSessionsMiddleware(config.get('sso:session'))));
    
//load user context
app.use(SSO.getContextMiddleware());

//... koa.js app



```

## Public Methods

### confirmMail
#### Description

- In:  
	- mail  
	- key    
- Out:  
	- true if everything allright
	- ValidationError if no key passed
		- code = 400 
		- message = 'Is is forbidden to use an empty key'
	- AuthError if no user found by mail and this key
		- code = 403 
		- message = 'Confirmation failed'
	- DbError if something bad occured in database
		- code = 500  
		- message = ''
		- err - error from database
#### Example

	
```js
// sso already defined and configured

let result = yield sso.confirmMail('anzuev@bk.ru', '03df24bcce1e45b231876fe5b2c405b0a4940ebc');
```


### confirmMobile
#### Description

- In:  
	- mail  
	- phone
	- key
- Out:  
	- true if everything allright 
	- ValidationError if no key passed
		- code = 400 
		- message = 'Is is forbidden to use an empty key'
	- AuthError if no user found by mail and this key
		- code = 403 
		- message = 'Confirmation failed'
	- DbError if something bad occured in database
		- code = 500  
		- message = ''
		- err - error from database
#### Example

	
```js
// sso already defined and configured

let result = yield sso.confirmMobile('anzuev@bk.ru', '+79210939059', '03df24bcce1e45b231876fe5b2c405b0a4940ebc');
```

### setPasswordKey
#### Description

- In:  
	- mail  
- Out:  
	- object if everything is allright
		- mail
		- key
	- ValidationError if no mail passed
		- code = 400 
		- message = 'Is is forbidden to use an empty mail'
	- AuthError if no user found by mail
		- code = 403 
		- message = 'No user found by mail {some mail}'
	- DbError if something bad occured in database
		- code = 500  
		- message = ''
		- err - error from database
#### Example

	
```js
// sso already defined and configured

let res = yield sso.setPasswordKey(anzuev@bk.ru);
```

### setPassword
#### Description

- In:  
	- mail 
	- key
	- newPassword
- Out:  
	- true if everything is allright
	- ValidationError if no key passed
		- code = 400 
		- message = 'Is is forbidden to use an empty key'
	- AuthError if no user found by mail and key
		- code = 403 
		- message = "Forbidden to set password by mail '{some mail}' and key='{some key}'"
	- DbError if something bad occured in database
		- code = 500  
		- message = ''
		- err - error from database  
#### Example

	
```js
// sso already defined and configured

let res = yield sso.setPassword(anzuev@bk.ru, '03df24bcce1e45b231876fe5b2c405b0a4940ebc', newPassword);
```


## History
1.4.0 - unstable version for express app  
2.0.0 - unstable version for koa.js
