# Week 05 Live Test Report

## Student
Кокарев Михаил

## Task
PATCH /quests/:id must reject title longer than 80 characters.

## Time
Start: 17:03
Finish: 17:40
Total minutes: 37 

## Branch and commits
Branch: live-test-week-05
Final commit: 87c0de8

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
Перед запросом проверям datafile с fixture на их равность
после проверяем также и чтобы ничего не изменилось черезе deepequal

Как проверен valid title длиной 80 символов:
assert.ok(resPatch.body.error.details.max === 80);
assert.ok(resPatch.body.error.details.data.length > 80);

Итог полного npm test:
ℹ tests 27
ℹ suites 2
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 427.9648

Что я могу объяснить после corrections:
необходимо досканально проверять все значения и ключи и их наличие 
много что я упускаю при проверке потому хороший test этот тест с большими кол-во assert и их точность