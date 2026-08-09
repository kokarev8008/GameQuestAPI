TRUNCATE TABLE quests RESTART IDENTITY;

INSERT INTO quests (title, difficulty, reward_xp, description) VALUES 
('beginner', 'easy', 20, 'your first quest!'),
('boss', 'hard', 500, 'your first boos!'),
('what do you think', 'medium', 50, 'come up with something'),
('first test', 'easy', 50, 'is not the trial'),
('find mom', 'hard', 5000, 'wher e is my mom?'),
('kill us', 'medium', 67, '(.)(.)'); 