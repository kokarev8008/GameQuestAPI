CREATE TABLE quests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    reward_xp INT CHECK (reward_xp > 0) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);