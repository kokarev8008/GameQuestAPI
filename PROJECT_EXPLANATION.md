1. Request flow:

Запрос может отправляться через разные ресурсы например curl/postman и др. или через frontend приложение

При отправке через выбранный ресурс или приложение запрос попадает в app где происходит вся небходимая инициализация для работы приложения(route, errorHandler, файл хранящий данные)

После чего запрос попадает в route где он выбирает путь в зависимости от endpoint-а (если такой путь есть)

Сначала отправленный запрос попадает в middleware - vlidation где проверяются ключи и их значения отправленные в запросе

Вскоре запрос (если он валиден) доходит до controller где также в зависимости от route выполняется действие например создание(POST) файла

Вследствии чего запрос попадает в storage (data.json) куда он и сериализуется 

В конце концов пользователю отправляется(response) body созданного(post) объекта  

2. Validation flow:

Возьмём в пример patch запрос (валидный) - перед попаданием в controller запрос приходит в middleware в данном примере в  idMiddleware потом в patchInspector

В idMiddleware проверяется params id где определяется является ли он положительным целочисленным значением 
Вскоре в patchInspector попадает body 
В patchInspector изначально проверяется на наличие пустоты в body 
Потом allowed field т.е входят ли ключи в белый список
В следующем при помощи сервиса валидации проходим по значениям уже защищёных полей 
Например: 
description - 0 < length > 300; type string
rewardXp is number; not float and >0

В конце концов он попадает в controller

3. Error flow:

Expected error - создаёт ErrorModule который предоставляет error handle middleware и error contract предоставляя минимальную инфоромацию об часто появляющихся ошибках в API

При передаче ошибки в next(error) он попадает в error handler middleware Который обязан иметь 4 параметра чтобы ошибка могла ему передатся 

В случае Unexpected error ошибка всё равно попадает в error handle middleware где помечается как Unexpected error + INTERNAL_ERROR и отправляя в console error данные об ошибке

4. Test flow:

Все тесты ипортируют app для реализации supertest который как бы инициализирует локально некое пространство скажем так сервер в котором он запускает запросы. app хранит нужные route и error handler middleware и то в какой файл идёт запись данных потому он необохим для tests

Все fixture находятся в папке fixtures где они распределены по запросам и их валидности

Reset файлов происходит в afterEach и before где просто вписывается fixture с валидными значениями и ключами в файл 

src/data.json не трогается так как он является production файлом и любые изменения будут видны обычным пользователям

5. Data contract:

field: id, title, difficulty, description, rewardXp, completed, createdAt

id, createdAt - управляет сам сервер и их изменить нельзя

title, difficulty(from white list), description(optional), rewardXp, completed(only patch) - предоставляет сам клиент которые можно изменять с определёнными ограничениями

type:
title, difficulty, description - string
rewardXp - integer >0
completed - boolean

6. Known limitations:

JSON storage - все данные записываются в единный srs/data.json 
Создание объектов происходит посредством id max + 1 могут возникнуть проблемы из-за race condition 
Собственно отсутсвует защита от race condition 
API не работает с БД из за обучения и отсутствует auth таже причина