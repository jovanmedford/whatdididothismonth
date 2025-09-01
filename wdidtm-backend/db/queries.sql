-- Get Log
SELECT
    email,
    categories.label category_label,
    activities.label activity_label,
    json_agg (success_logs.day) successes
FROM
    users
    JOIN categories ON users.id = categories.user_ID
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    JOIN success_logs ON activity_logs.id = success_logs.activity_log_id
WHERE
    users.email = 'alice@test.com'
    AND activity_logs.year = 2025
    AND activity_logs.month = 8;

GROUP BY
    email,
    categories.label,
    activities.label,
    activity_logs.year,
    activity_logs.month;

-- Create Category
INSERT INTO
    categories (user_id, label, color, icon)
VALUES
    (
        "some-user",
        "Finances",
        "green",
        "/path"
    );
-- Create Activity
INSERT INTO
    activities (label, cat_id) VALUES ("new", "uncategorized")
BEGIN;
-- Create Category
-- Create Activity
-- Create Activity Log
COMMIT;


-- 
SELECT
    activities.id AS "activityId",
    activities.label AS "activityName",
    categories.label AS "categoryName",
    categories.color AS "categoryColor",
    categories.icon AS "categoryIcon",
    json_agg (success_logs.day) successes,
    activity_logs.target target
FROM
    users
    JOIN categories ON users.id = categories.user_id
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    JOIN success_logs ON activity_logs.id = success_logs.activity_log_id
WHERE
    users.email = $1 AND activity_logs.year = $2 AND activity_logs.month = $3
GROUP BY 
    activities.id,
    activities.label
    categories.label,
    categories.color,
    categories.icon,
    activity_logs.target;


-- Add and remove success

INSERT INTO success_logs (activity_log_id, day) VALUES ('aaaaaaaa-1000-0000-0000-000000000002', 1) RETURNING activity_log_id;

DELETE FROM success_logs WHERE activity_log_id = 'aaaaaaaa-1000-0000-0000-000000000002' AND day = 1;

-- Check Activity Owner 
SELECT
    email
    FROM
    users
    JOIN categories ON users.id = categories.user_id
    JOIN activities ON categories.id = activities.cat_id
    JOIN activity_logs ON activities.id = activity_logs.activity_id
    WHERE activity_logs.id = 'aaaaaaaa-1000-0000-0000-000000000002';


-- Creation Steps

BEGIN;
INSERT INTO categories (name, color, icon) VALUES ("Hobbies", "purple", "");
INSERT INTO activities ()
COMMIT;

SELECT * FROM categories WHERE email = 'jovan_medford@hotmail.com';