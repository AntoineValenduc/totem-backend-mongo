-- Création BDD
CREATE DATABASE totem;
\c totem;

-- Création utilisateur avec accès réduit
CREATE USER appuser WITH PASSWORD 'TotemDatabasePostgresPw';
GRANT CONNECT ON DATABASE totem TO appuser;

-- Déplacement dans la BDD
\c totem;

-- Création des tables

--User
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    tempPassword TEXT,
    role TEXT NOT NULL,
    isFirstLogin BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT now()
);

--Invitation
CREATE TABLE IF NOT EXISTS invitation_tokens (
    id UUID PRIMARY KEY,
    token TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now(),
    invitedBy TEXT,
    usedAt TIMESTAMP
);

-- Autoriser utilisateur appuser à lecture/écriture
GRANT USAGE ON SCHEMA public TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO appuser;

-- S'assurer que les futures tables soient aussi accessibles
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO appuser;