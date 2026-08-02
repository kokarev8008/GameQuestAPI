# Week 05 Live Test Report

## Student
Кокарев Михаил

## Task
PATCH /quests/:id must reject title longer than 80 characters.

## Time
Start: 17:03
Finish: 18:02
Total minutes: 59 - full time

37 min - familiarization docx
22 - report live test and docx report

## Branch and commits
Branch: live-test-week-5
Final commit: 
87c0de8 - code/test cprrections
307b754 - upfdate report live test

## Red state
What test did I write first?
Тест на проверку PATCH что длина title > 80

What did I expect?
400

What actually happened when I ran the test?
200, так как validation flow установлен на max: 100

Command used:
assert.equal(resPatch.status, 400);

## Cause
Where was the missing behavior?
DataBodyQuestValidService

Why did the old code allow this case?
Так как в качестве проверки max был установлен на 100 а не на 80

## Minimal fix
Which file(s) did I change?
03-patch.test, DataBodyQuestValidService, BaseValidService
Также была добавлена fixture для title > 80 и она была добавлена в patchStorage

What exactly did I change?
добали тест в файл с PACTH, в validationFlow исправил 100 -> 80, а в сервисе validation добавил поля для определения максимально Length, 

Why is this fix minimal?
Так как было измененно лишь валидация длины допускаемого title, потом добавление поля чтобы легче было брать в тесте максимально значение длины title, и собственно был добавлен сам тест

## Assertions proving the contract
- status 400: assert.equal(resPatch.status, 400);
- error.code VALIDATION_ERROR: assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
- details.field title: assert.ok(Object.hasOwn(resPatch.body.error.details, "title"));
- details.max 80: assert.ok(resPatch.body.error.details.maxLength === 80);
- storage unchanged: assert.deepEqual(initialBodyQuestData, bodyQuest);

## Final test result
Paste npm test summary here: 
ℹ tests 27
ℹ suites 2
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 416.7883

## Git diff summary
What files changed and why?
03-patch.test - так как нужно было добавить тест 
DataBodyQuestValidService - нужно было исправить максимально значение с 100 на 80 для green test
BaseValidService - нужно было добавать поле чтобы лечгче было определить максимально значение хранимое в тексте

## What I did not finish / blockers
Всё было завершено

## What I can explain after the test
Что тест должен проверяться глубоко иначе могут возникнуть некоторые проблемы в будущем при изменени других тестов
Также тесты иногда не требуют большого кол-ва изменений чтобы они были green и не обязательно делать какую то заумную архитектуру, смысл в ней будет только если подобных тестов будет много и они будут похожи друг на друга но с незначительными отличиями либо в ином каком либо специфичном случае 

## Post-review corrections

Branch: live-test-week-5

Correction commit SHA: 87c0de8

Какие exact details теперь возвращает invalid PATCH:
field, data, cause, max

Как test доказывает неизменность runtime storage: 
before: считываем файл fixture readyValidBody-quests и записываем в tmp файл readyBody-quests эту самую fixture
через deepequal сравниваем fixture и tmp файл чтобы убедиться в правильности записи
after: считываем tmp файл и через deepequal сравниваем с fixture в случае ошибки файл измениться не должен  

Как проверен valid title длиной 80 символов:
assert.ok(resPatch.body.error.details.max === 80);
assert.ok(resPatch.body.error.details.data.length > 80);
ну по факту это всё и есть valid title я не понимаю что тут не так 

Итог полного npm test:
Error: Error
    at QuestController._getAllData (file:///S:/Coding/fullstackProject/GameQuestAPI/src/controllers/questController.js:139:18)
    at async QuestController.getQuests (file:///S:/Coding/fullstackProject/GameQuestAPI/src/controllers/questController.js:12:25)
✔ INTERNAL_ERROR + 500 through GET /quests - errorPath (21.2432ms)
Error: Error
    at QuestController._getAllData (file:///S:/Coding/fullstackProject/GameQuestAPI/src/controllers/questController.js:139:18)
    at async QuestController.getQuests (file:///S:/Coding/fullstackProject/GameQuestAPI/src/controllers/questController.js:12:25)
✔ INTERNAL_ERROR + 500 through GET /quests - SyntaxError Json (5.3146ms)
✔ GET /quests returns an array (20.3657ms)
✔ GET /quests/1 returns an object (5.6488ms)
✔ GET /quests/abc and /quests/0 return 400 + INVALID_QUEST_ID (9.1854ms)
✔ GET /quests/999 return 404 + QUEST_NOT_FOUND (5.9805ms)
✔ GET /unknown return 404 + ROUTE_NOT_FOUND (5.712ms)
▶ GET /quests?difficulty
  ✔ 200 - valid (easy) (5.7679ms)
  ✔ 400 + VALIDATION_ERROR - unknown (6.6958ms)
✔ GET /quests?difficulty (12.9515ms)
✔ POST /quests 201 + create quest with id/createdAt/completed/ description by default(38.5847ms)
✔ POST /quests 400 + VALIDATION_ERROR - title missing (7.5103ms)
✔ POST /quests 400 + VALIDATION_ERROR - rewardXp string (7.5455ms)
✔ POST /quests 400 + VALIDATION_ERROR - rewardXp=0, decimal, wrong difficulty (12.0398ms)
✔ POST /quests 400 + VALIDATION_ERROR - completed/id/createdAt/unknownField (5.3665ms)▶ POST /quests - description
  ✔ 400 + VALIDATION_ERROR - is not a string (5.4858ms)
  ✔ 400 + VALIDATION_ERROR - length > 300 (3.8284ms)
✔ POST /quests - description (9.6267ms)
✔ PATCH /quests/1 200 - valid (44.459ms)
✔ PATCH /quests/1 200 + description cleared (10.236ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - id/createdAt/unknownField (6.7199ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - empty body (5.0896ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - title type (5.6638ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - title Length > 80 (5.9686ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - rewardXp is string (4.7771ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - description length > 300 (3.6724ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - descriptionType (5.6756ms)
✔ PATCH /quests/1 400 + VALIDATION_ERROR - completed is string (4.8138ms)
✔ DELETE /quests/1 204 - body is empty (23.2974ms)
ℹ tests 27
ℹ suites 2
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 418.1544

Что я могу объяснить после corrections:
необходимо досканально проверять все значения и ключи и их наличие 
много что я упускаю при проверке потому хороший test этот тест с большими кол-во assert и их точность