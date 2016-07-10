# Модули

## SSO
    
* [SSO](#module_SSO)
    * [~SSO](#module_SSO..SSO)
        * [.configure(config)](#module_SSO..SSO.configure)
        * [.getSessionsMiddleware()](#module_SSO..SSO.getSessionsMiddleware) ⇒ <code>\*</code>
        * [.getContextMiddleware()](#module_SSO..SSO.getContextMiddleware) ⇒ <code>loadContext</code>
        * [.isPasswordChangeAllowed(session)](#module_SSO..SSO.isPasswordChangeAllowed) ⇒ <code>boolean</code>
        * [.confirmPasswordChange()](#module_SSO..SSO.confirmPasswordChange) ⇒ <code>boolean</code>
        * [.dropPasswordChangeAccess(next)](#module_SSO..SSO.dropPasswordChangeAccess)
        * [.checkAuth(next)](#module_SSO..SSO.checkAuth)
        * [.checkMailActivation(next)](#module_SSO..SSO.checkMailActivation)
        * [.checkMobileActivation(next)](#module_SSO..SSO.checkMobileActivation)
        * [.checkDocumentActivation(next)](#module_SSO..SSO.checkDocumentActivation)
        * [.signIn(next)](#module_SSO..SSO.signIn)
        * [.signIn(next)](#module_SSO..SSO.signIn)
        * [.checkPermission(user, fileId)](#module_SSO..SSO.checkPermission) ⇒ <code>\*</code> &#124; <code>boolean</code>


# Методы

## &nbsp;&nbsp;SSO
  <a name="module_SSO..SSO"></a>

### SSO~SSO
**Kind**: inner class of <code>[SSO](#module_SSO)</code>  

* [~SSO](#module_SSO..SSO)
    * [.configure(config)](#module_SSO..SSO.configure)
    * [.getSessionsMiddleware()](#module_SSO..SSO.getSessionsMiddleware) ⇒ <code>\*</code>
    * [.getContextMiddleware()](#module_SSO..SSO.getContextMiddleware) ⇒ <code>loadContext</code>
    * [.isPasswordChangeAllowed(session)](#module_SSO..SSO.isPasswordChangeAllowed) ⇒ <code>boolean</code>
    * [.confirmPasswordChange()](#module_SSO..SSO.confirmPasswordChange) ⇒ <code>boolean</code>
    * [.dropPasswordChangeAccess(next)](#module_SSO..SSO.dropPasswordChangeAccess)
    * [.checkAuth(next)](#module_SSO..SSO.checkAuth)
    * [.checkMailActivation(next)](#module_SSO..SSO.checkMailActivation)
    * [.checkMobileActivation(next)](#module_SSO..SSO.checkMobileActivation)
    * [.checkDocumentActivation(next)](#module_SSO..SSO.checkDocumentActivation)
    * [.signIn(next)](#module_SSO..SSO.signIn)
    * [.signIn(next)](#module_SSO..SSO.signIn)
    * [.checkPermission(user, fileId)](#module_SSO..SSO.checkPermission) ⇒ <code>\*</code> &#124; <code>boolean</code>

<a name="module_SSO..SSO.configure"></a>

#### SSO.configure(config)
Настройка модуля(обязательно перед использованием)
Настраивает логгер и соединение к бд
Пример конфига:
<pre><code>
 {
   "mongoose":{
	 "UsersUri": "mongodb://127.0.0.1/test_IStudentAPI",
	 "PSSUri": "mongodb://127.0.0.1/test_PSS",
	 "SSOUri": "mongodb://127.0.0.1/test_sso"
   },
   "sso":{
	 "session":{
	   "secret": "superSecretKey",
	   "key": "StudCloud:session:",
	   "cookie":{
		 "path": "/",
		 "maxAge":2592000000,
		 "httpOnly": true
	   }
	 }
   },
   "logs":{
	 "UAMS":{
	   "path": "/Users/anton/GitHub/SSO/logs/UAMS.log",
	   "label": "UAMS"
	 },
	 "SSO":{
	   "path": "/Users/anton/GitHub/SSO/logs/SSO.log",
	   "label": "SSO"
	 }
   }

 }
 </code></pre>

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  

| Param | Description |
| --- | --- |
| config | конфигурация типа nconf |

<a name="module_SSO..SSO.getSessionsMiddleware"></a>

#### SSO.getSessionsMiddleware() ⇒ <code>\*</code>
Получение миддлвера сессий

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>Error</code> , модуль не был настроен

**Example**  
```js
app.use(SSO.getSessionsMiddleware();
```
<a name="module_SSO..SSO.getContextMiddleware"></a>

#### SSO.getContextMiddleware() ⇒ <code>loadContext</code>
Получение миддлвера для загрузки контекста

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>Error</code> , модуль не был настроен

**Example**  
```js
app.use(SSO.getContextMiddleware());
```
<a name="module_SSO..SSO.isPasswordChangeAllowed"></a>

#### SSO.isPasswordChangeAllowed(session) ⇒ <code>boolean</code>
Проверка можно ли пользователю менять пароль

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Returns**: <code>boolean</code> - , true - можно, false - нельзя  

| Param | Description |
| --- | --- |
| session | объект типа koa-session |

<a name="module_SSO..SSO.confirmPasswordChange"></a>

#### SSO.confirmPasswordChange() ⇒ <code>boolean</code>
Миддлвер для валидации ключа для смены, если ключ верный, то метод isPasswordChangeAllowed будет возвращать true
В this.state.passwordKey должен быть помещен ключ

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Returns**: <code>boolean</code> - , true - ключ верный, false - ключ не верный  
<a name="module_SSO..SSO.dropPasswordChangeAccess"></a>

#### SSO.dropPasswordChangeAccess(next)
Миддлвер для сброса возможности менять пароль для данной сессии. Вызывается после смены пароля.

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  

| Param |
| --- |
| next | 

<a name="module_SSO..SSO.checkAuth"></a>

#### SSO.checkAuth(next)
Миддлвер для проверки авторизован ли пользователь или нет

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 405 - уровень авторизации недостаточен

**this**: <code>SSO</code>  

| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/doSomething', require('path/to/handler.js', SSO.checkAuth);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
    // если все хорошо, продолжится выполнение
    // если пользователь не авторизован, будет ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.checkMailActivation"></a>

#### SSO.checkMailActivation(next)
Миддлвер для проверки уровня авторизации(подтвердена либо почта, либо документ либо телефон)

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 405 - уровень авторизации недостаточен


| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/doSomething', require('path/to/handler.js', SSO.checkMailActivation);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
    // если уровень авторизации > 1, то продолжится выполнение
    // иначе ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.checkMobileActivation"></a>

#### SSO.checkMobileActivation(next)
Миддлвер для проверки уровня авторизации(подтверден либо документ, либо телефон)

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 405 - уровень авторизации недостаточен


| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/doSomething', require('path/to/handler.js', SSO.checkMobileActivation);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
    // если уровень авторизации > 2, то продолжится выполнение
    // иначе ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.checkDocumentActivation"></a>

#### SSO.checkDocumentActivation(next)
Миддлвер для проверки уровня авторизации(подтверден документ)

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 405 - уровень авторизации недостаточен


| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/doSomething', require('path/to/handler.js', SSO.checkMobileActivation);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
     // если уровень авторизации > 3, то продолжится выполнение
    // иначе ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.signIn"></a>

#### SSO.signIn(next)
Миддлвер для авторизации пользователя.
Перед вызовом необходимо убедиться, что внутри this.authData находятся необходимые данные.
Необходимые проперти - mail и password

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 401 - неверный парль


| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/signIn', require('path/to/handler.js', SSO.signIn);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
    // если все хорошо, продолжится выполнение
    // если пароль не верный, будет ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.signIn"></a>

#### SSO.signIn(next)
Миддлвер для авторизации пользователя

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>AuthError</code> , 401 - неверный парль


| Param | Description |
| --- | --- |
| next | переход к следующему миддлверу |

**Example**  
```js
//router file
    router.get('/signIn', require('path/to/handler.js', SSO.signIn);
 // path/to/handler.js
    ...
    let a = b;
    yield next;
    // если все хорошо, продолжится выполнение
    // если пароль не верный, будет ошибка
    // и управление попадет обработчику ошибок
    ...
```
<a name="module_SSO..SSO.checkPermission"></a>

#### SSO.checkPermission(user, fileId) ⇒ <code>\*</code> &#124; <code>boolean</code>
Проверка можно ли пользователю скачивать/просматривать файл

**Kind**: static method of <code>[SSO](#module_SSO..SSO)</code>  
**Throws**:

- <code>DbError</code> , 404 - файл не найден
- <code>DbError</code> , 404 - если файл доступен только людям из группы и автор файла не был найден


| Param | Description |
| --- | --- |
| user | пользователь(объект типа user) |
| fileId | идентификатор файла для просмотра |

