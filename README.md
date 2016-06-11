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

## Public Methods
### signUp
#### Description

- In:  
	- authData object  
		- name  
		- surname  
		- mail  
		- password    
- Out:  
	- user object from collection 'users'    
	- ValidationError if data hasn't passed validation  
		- code = 400  
		- message = 'Mail is incorrect' or 'Password is too weak' or 'Incorrect personal info'  
	- AuthError if user with such mail already exists in collection  
		- code = 400  
		- message = mail {some mail} already in use  

#### Example
	
```js
// sso already defined and configured

let authData = {
		name: "Anton",
		password: "sdkmskdmsf",
		surname: "Zuev",
		mail: "anzuev@bk.ru"
	};
let user = yield sso.signUp(authData);
```

### signIn
#### Description

- In:  
	- authData object  
		- mail  
		- password    
- Out:  
	- user object from collection 'users'    
	- AuthError if no user found by mail 
		- code = 401 
		- message = 'Incorrect mail'
	- AuthError if password isn't correct
		- code = 401 
		- message = 'Incorrect password'
	- DbError if something bad occured in database
		- code = 500  
		- message = ''
		- err - error from database

#### Example
	
```js
// sso already defined and configured

let authData = {
		name: "Anton",
		password: "sdkmskdmsf"
	};
let user = yield sso.signIn(authData);
```

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

let res = yield sso.setPasswordKey(anzuev@bk.ru);
```


## History

First version - 1.0.0  
Current version - 1.1.0
