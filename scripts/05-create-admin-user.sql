-- Criar usuário administrador no Supabase Auth
-- Este script deve ser executado após a criação das tabelas

-- Primeiro, vamos verificar se o usuário já existe
DO $$
BEGIN
    -- Inserir o usuário admin se não existir
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'estrategia@designmarketing.com.br',
        crypt('Jivago14#', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Administrador Integrare"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING;

    -- Inserir na tabela de identidades se não existir
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) SELECT 
        gen_random_uuid(),
        u.id,
        format('{"sub": "%s", "email": "%s"}', u.id::text, u.email)::jsonb,
        'email',
        NOW(),
        NOW(),
        NOW()
    FROM auth.users u 
    WHERE u.email = 'estrategia@designmarketing.com.br'
    AND NOT EXISTS (
        SELECT 1 FROM auth.identities i 
        WHERE i.user_id = u.id AND i.provider = 'email'
    );

END $$;

SELECT 'Usuário administrador criado com sucesso!' as resultado;
SELECT 'Email: estrategia@designmarketing.com.br' as email;
SELECT 'Senha: Jivago14#' as senha;
