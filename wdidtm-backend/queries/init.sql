CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    first_name varchar(255),
    last_name varchar(255),
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    label varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    icon varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, label)
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label varchar(255) NOT NULL,
    cat_id UUID REFERENCES categories(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(cat_id, label)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    month int NOT NULL,
    year int NOT NULL,
    target int NOT NULL,
    activity_id UUID REFERENCES activities(id) NOT NULL,
    UNIQUE(activity_id, year, month)
);

CREATE TABLE IF NOT EXISTS success_logs (
    activity_log_id UUID REFERENCES activity_logs(id) NOT NULL,
    day int NOT NULL,
    PRIMARY KEY(activity_log_id, day),
    UNIQUE(activity_log_id, day)
);
