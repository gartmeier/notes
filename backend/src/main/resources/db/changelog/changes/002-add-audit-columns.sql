--liquibase formatted sql

--changeset notes:2
ALTER TABLE notes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notes ADD COLUMN version BIGINT DEFAULT 0;
