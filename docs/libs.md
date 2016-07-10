<a name="UAMS"></a>

## UAMS
**Kind**: global class  
**this**: <code>{UAMS}</code>  

* [UAMS](#UAMS)
    * [.init()](#UAMS+init)
    * [.getUserById(id)](#UAMS+getUserById) ⇒ <code>user</code>
    * [.getUserByMail(mail)](#UAMS+getUserByMail) ⇒ <code>user</code>
    * [.getUserByPhone(phone)](#UAMS+getUserByPhone) ⇒ <code>user</code>
    * [.getUsersByKeyAndContext(key, context)](#UAMS+getUsersByKeyAndContext) ⇒
    * [.getUsersByTwoKeysAndContext(key1, key2, context)](#UAMS+getUsersByTwoKeysAndContext) ⇒
    * [.getUsersByUniversity(university)](#UAMS+getUsersByUniversity) ⇒
    * [.getUsersByFaculty(faculty)](#UAMS+getUsersByFaculty) ⇒
    * [.getUsersByGroup(university, faculty, group)](#UAMS+getUsersByGroup) ⇒
    * [.getUsersByYear(year)](#UAMS+getUsersByYear) ⇒
    * [.getUsersByMailConfirmation(skip)](#UAMS+getUsersByMailConfirmation) ⇒
    * [.countUsersByMailConfirmation()](#UAMS+countUsersByMailConfirmation) ⇒ <code>number</code>
    * [.getUsersByMobileConfirmation(skip)](#UAMS+getUsersByMobileConfirmation) ⇒
    * [.countUsersByMobileConfirmation()](#UAMS+countUsersByMobileConfirmation) ⇒ <code>number</code>
    * [.countNewUsersToday()](#UAMS+countNewUsersToday) ⇒ <code>number</code>
    * [.countNewUsersThisWeek()](#UAMS+countNewUsersThisWeek) ⇒ <code>number</code>
    * [.countNewUsersThisMonth()](#UAMS+countNewUsersThisMonth) ⇒ <code>number</code>
    * [.countNewUsersThisYear()](#UAMS+countNewUsersThisYear) ⇒ <code>number</code>
    * [.countAllUsers()](#UAMS+countAllUsers) ⇒ <code>number</code>
    * [.createUser(authData)](#UAMS+createUser) ⇒ <code>user</code>
    * [.blockUser(userId)](#UAMS+blockUser) ⇒ <code>boolean</code>
    * [.removeUser(userId)](#UAMS+removeUser) ⇒ <code>boolean</code>

<a name="UAMS+init"></a>

### uamS.init()
Инициализация модуля. Здесь проверяем соединение к базе данных.

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Throws**:

- <code>Error</code> - не указано соединение для коллекции 'users'

<a name="UAMS+getUserById"></a>

### uamS.getUserById(id) ⇒ <code>user</code>
Получение пользователя по id

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>user</code> - объект типа user  
**Throws**:

- <code>DbError</code> - 404, пользователь не найден
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| id | идентификатор пользователя |

<a name="UAMS+getUserByMail"></a>

### uamS.getUserByMail(mail) ⇒ <code>user</code>
Получение пользователя по почте

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>user</code> - объект типа user  
**Throws**:

- <code>DbError</code> - 404, пользователь не найден
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| mail | почтовый адрес |

<a name="UAMS+getUserByPhone"></a>

### uamS.getUserByPhone(phone) ⇒ <code>user</code>
Получение пользователя по номеру телефона

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>user</code> - объект типа user  
**Throws**:

- <code>DbError</code> - 404, пользователь не найден
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| phone | <code>string</code> | номер телефона |

<a name="UAMS+getUsersByKeyAndContext"></a>

### uamS.getUsersByKeyAndContext(key, context) ⇒
Поиск пользователей по ключу и контексту.

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| key |  | регулярное выражение, сгенерированное на основе данных от пользователя. |
| context | <code>object</code> | контекст поиска. Возможны проверти university(objectId), faculty(objectId), year(number), group(string) |

<a name="UAMS+getUsersByTwoKeysAndContext"></a>

### uamS.getUsersByTwoKeysAndContext(key1, key2, context) ⇒
Поиск пользователей по двум ключам и контексту

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| key1 |  | регулярное выражение, сгенерированное на основе данных от пользователя. |
| key2 |  | регулярное выражение, сгенерированное на основе данных от пользователя. |
| context | <code>object</code> | контекст поиска. Возможны проверти university(objectId), faculty(objectId), year(number), group(string) |

<a name="UAMS+getUsersByUniversity"></a>

### uamS.getUsersByUniversity(university) ⇒
Поиск пользователей по университету

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| university | <code>Mongoose.Types.ObjectId</code> | id университета |

<a name="UAMS+getUsersByFaculty"></a>

### uamS.getUsersByFaculty(faculty) ⇒
Поиск пользователей по факультету

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| faculty | <code>Mongoose.Types.ObjectId</code> | id факультета |

<a name="UAMS+getUsersByGroup"></a>

### uamS.getUsersByGroup(university, faculty, group) ⇒
Поиск пользователей по группе

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| university | <code>Mongoose.Types.ObjectId</code> | id университета |
| faculty | <code>Mongoose.Types.ObjectId</code> | id факультета |
| group | <code>Mongoose.Types.ObjectId</code> | группа(string) |

<a name="UAMS+getUsersByYear"></a>

### uamS.getUsersByYear(year) ⇒
Поиск пользователей по курсу

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Type | Description |
| --- | --- | --- |
| year | <code>Mongoose.Types.ObjectId</code> | год обучения(курс) |

<a name="UAMS+getUsersByMailConfirmation"></a>

### uamS.getUsersByMailConfirmation(skip) ⇒
Поиск пользователей с подтвержденной почтой

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- ValidationError - 400, параметр skip < 0
- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| skip | сколько страниц сначала необходимо пропустить. На странице 20 элементов. |

<a name="UAMS+countUsersByMailConfirmation"></a>

### uamS.countUsersByMailConfirmation() ⇒ <code>number</code>
Подсчет количества пользователей с подтвержденной почтой

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+getUsersByMobileConfirmation"></a>

### uamS.getUsersByMobileConfirmation(skip) ⇒
Поиск пользователей с подтвержденным номером телефона

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: [user] массив из объектов типа user, если хотя бы один пользователь найден  
**Throws**:

- ValidationError - 400, параметр skip < 0
- <code>DbError</code> - 204, не найдено пользователей, удовлетворяющих условиям
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| skip | сколько страниц сначала необходимо пропустить. На странице 20 элементов. |

<a name="UAMS+countUsersByMobileConfirmation"></a>

### uamS.countUsersByMobileConfirmation() ⇒ <code>number</code>
Подсчет количества пользователей с подтвержденным номером телефона

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+countNewUsersToday"></a>

### uamS.countNewUsersToday() ⇒ <code>number</code>
Подсчет новых пользователей за сегодня

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+countNewUsersThisWeek"></a>

### uamS.countNewUsersThisWeek() ⇒ <code>number</code>
Подсчет новых пользователей за неделю

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+countNewUsersThisMonth"></a>

### uamS.countNewUsersThisMonth() ⇒ <code>number</code>
Подсчет новых пользователей за месяц

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+countNewUsersThisYear"></a>

### uamS.countNewUsersThisYear() ⇒ <code>number</code>
Подсчет новых пользователей за год

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+countAllUsers"></a>

### uamS.countAllUsers() ⇒ <code>number</code>
Подсчет новых пользователей за все время

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>number</code> - Количество пользователей  
**Throws**:

- <code>DbError</code> - 500, ошибка базы данных

<a name="UAMS+createUser"></a>

### uamS.createUser(authData) ⇒ <code>user</code>
Создание нового пользователя

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>user</code> - объект типа user, если все прошло успешно  
**Throws**:

- <code>ValidationError</code> 400, Mail is incorrect - длина почты меньше 5
- <code>ValidationError</code> 400, Password is too weak - длина пароля меньше 5
- <code>ValidationError</code> 400, Incorrect personal info - имя или фамилия не переданы
- <code>AuthError</code> 400, mail {mail} already in use - почта уже кем-то используется
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| authData | данные для авторизации. Пропирти можно увидеть в пункте properties |

**Properties**

| Name | Description |
| --- | --- |
| mail | почтовый адрес |
| password | пароль |
| name | имя пользователя |
| surname | пароль |

<a name="UAMS+blockUser"></a>

### uamS.blockUser(userId) ⇒ <code>boolean</code>
Блокировка юзера

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>boolean</code> - true - все прошло хорошо  
**Throws**:

- <code>DbError</code> - 404, пользователь не найден
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| userId | идентификатор пользователя |

<a name="UAMS+removeUser"></a>

### uamS.removeUser(userId) ⇒ <code>boolean</code>
Удаление пользователя по идентификатору

**Kind**: instance method of <code>[UAMS](#UAMS)</code>  
**Returns**: <code>boolean</code> - true - все прошло хорошо  
**Throws**:

- <code>DbError</code> - 400, пользователь не найден
- <code>DbError</code> - 500, ошибка базы данных


| Param | Description |
| --- | --- |
| userId | идентификатор пользователя |

