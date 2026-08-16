1. Schema decisions:
id - primary key,
title - varchar(80) not null,
difficulty - not null only (easy, medium, hard),
reward_xp - int > 0 not null,
desciption - text,
completed - boolean not null default false,
created_at - timestamptz 

2. Environment:
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=quest
DB_TEST_DATABASE=test_quests
DB_PASSWORD=123
DB_PORT=5432

reset db scheme from dbInit.js

3. Repository flow:
pool - выступает здесь в роли регистрации pg для запросов к базе данных там же и инициализируется .env
Repository оснащён parameterized queries для предотвращения всякого рода sql-inject-ов 
В repository реализован mapping from snake_case to camelCase так как бд воззращаен зараннее не регламентированый style name field (есть два метода для класса Quest и для неопределённых заранне типов сделано это исключительно ради удобства)
В случае ошибок при запросе к бд методы возвращают null

4. Test isolation:
При запуске тестов к бд меняется connection к test database 
Вскоре инициализируется таблица и создаются данные из seed (происходит это посредством сервиса dbInit.js)
Изменение connection дб показывает самый первый запускаемый тест 
После выполнения каждого теста запускается cleanup bd т.е очищается таблица и создаются данные из seed
В самом конце закрывется pool 

5. Quest Analytics:
Аналитика подрузамевает под собой конкретное кол-во quest по нескольким характеристикам регламентированные контрактом 
Для его подсчёта используюся агрегатные функции предоставляемые psql 
Так как данные метод является зараннее неопределёным типом его response проходит через mapping метод для неопределённого типа
Все значения ключей после response являются типом integer за исключением averageRewardXp - REAL ограниченный 2 знаками после запятойSQL injection protection 

6. Security and failures:
Защита sql injection происходит посредством parameterized queries безопасныйм внедрением значений в параметры sql через плейсхолдеры 
В случае внутренних ошибок со стороны бд возращается null и он попадает в error handler middeware где он безопасно логируется 

7. Known limitations:
API имеет эксперементальную функцию(lab app(analytic)) которая не является прямым дополнением и в тоже время он изолирован он прочих функции основной реализации 
Созданный CRUD в данный момент не мигрирован 

8. Next step:

В week 7 будет проделана большая работа в первую очереди про миграцию новой системы CRUD и адаптации тестов 