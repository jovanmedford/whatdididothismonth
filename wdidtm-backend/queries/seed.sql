BEGIN;

-- === USERS ===
INSERT INTO users (id, email, first_name, last_name)
VALUES
    ('00000000-0000-0000-0000-000000000000', 'system@wdidtm.com', 'System', NULL),
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice', 'Thompson'),
    ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob', 'Singh'),
    ('33333333-3333-3333-3333-333333333333', 'carol@example.com', 'Carol', 'Rodriguez')
ON CONFLICT (email) DO NOTHING;


-- === CATEGORIES ===
INSERT INTO categories (id, user_id, label, color, icon)
VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Uncategorized', '#9CA3AF', 'circle'),

    ('11111111-aaaa-aaaa-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'Health', '#34D399', 'heart'),
    ('11111111-bbbb-bbbb-bbbb-111111111111', '11111111-1111-1111-1111-111111111111', 'Learning', '#60A5FA', 'book'),

    ('22222222-aaaa-aaaa-aaaa-222222222222', '22222222-2222-2222-2222-222222222222', 'Fitness', '#F87171', 'dumbbell'),
    ('22222222-bbbb-bbbb-bbbb-222222222222', '22222222-2222-2222-2222-222222222222', 'Finance', '#FBBF24', 'dollar-sign'),

    ('33333333-aaaa-aaaa-aaaa-333333333333', '33333333-3333-3333-3333-333333333333', 'Wellness', '#A78BFA', 'smile'),
    ('33333333-bbbb-bbbb-bbbb-333333333333', '33333333-3333-3333-3333-333333333333', 'Productivity', '#10B981', 'check')
ON CONFLICT (user_id, label) DO NOTHING;


-- === ACTIVITIES ===
INSERT INTO activities (id, label, cat_id)
VALUES
    ('11111111-aaaa-cccc-aaaa-111111111111', 'Morning Jog', '11111111-aaaa-aaaa-aaaa-111111111111'),
    ('11111111-bbbb-cccc-bbbb-111111111111', 'Read a Book', '11111111-bbbb-bbbb-bbbb-111111111111'),

    ('22222222-aaaa-cccc-aaaa-222222222222', 'Lift Weights', '22222222-aaaa-aaaa-aaaa-222222222222'),
    ('22222222-bbbb-cccc-bbbb-222222222222', 'Track Expenses', '22222222-bbbb-bbbb-bbbb-222222222222'),

    ('33333333-aaaa-cccc-aaaa-333333333333', 'Meditate', '33333333-aaaa-aaaa-aaaa-333333333333'),
    ('33333333-bbbb-cccc-bbbb-333333333333', 'Plan Day', '33333333-bbbb-bbbb-bbbb-333333333333')
ON CONFLICT (cat_id, label) DO NOTHING;


-- === ACTIVITY_LOGS ===
INSERT INTO activity_logs (id, month, year, target, activity_id)
VALUES
    ('11111111-aaaa-dddd-aaaa-111111111111', 10, 2025, 20, '11111111-aaaa-cccc-aaaa-111111111111'),
    ('11111111-bbbb-dddd-bbbb-111111111111', 10, 2025, 15, '11111111-bbbb-cccc-bbbb-111111111111'),

    ('22222222-aaaa-dddd-aaaa-222222222222', 10, 2025, 25, '22222222-aaaa-cccc-aaaa-222222222222'),
    ('22222222-bbbb-dddd-bbbb-222222222222', 10, 2025, 10, '22222222-bbbb-cccc-bbbb-222222222222'),

    ('33333333-aaaa-dddd-aaaa-333333333333', 10, 2025, 30, '33333333-aaaa-cccc-aaaa-333333333333'),
    ('33333333-bbbb-dddd-bbbb-333333333333', 10, 2025, 31, '33333333-bbbb-cccc-bbbb-333333333333')
ON CONFLICT (activity_id, year, month) DO NOTHING;


-- === SUCCESS_LOGS ===
INSERT INTO success_logs (activity_log_id, day)
VALUES
    ('11111111-aaaa-dddd-aaaa-111111111111', 1),
    ('11111111-aaaa-dddd-aaaa-111111111111', 2),
    ('11111111-aaaa-dddd-aaaa-111111111111', 4),

    ('11111111-bbbb-dddd-bbbb-111111111111', 3),
    ('11111111-bbbb-dddd-bbbb-111111111111', 5),

    ('22222222-aaaa-dddd-aaaa-222222222222', 1),
    ('22222222-aaaa-dddd-aaaa-222222222222', 2),

    ('33333333-aaaa-dddd-aaaa-333333333333', 1),
    ('33333333-aaaa-dddd-aaaa-333333333333', 2),
    ('33333333-aaaa-dddd-aaaa-333333333333', 3)
ON CONFLICT DO NOTHING;

COMMIT;
