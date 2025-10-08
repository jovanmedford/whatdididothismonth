Begin;

INSERT INTO
    users (id, email, first_name)
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'system@wdidtm.com',
        'system'
    ) ON CONFLICT DO NOTHING;

INSERT INTO
    categories (id, user_id, label, color, icon)
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'Uncategorized',
        '#9CA3AF',
        'circle'
    ) ON CONFLICT DO NOTHING;

COMMIT;