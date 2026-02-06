--liquibase formatted sql

--changeset notes:003
ALTER TABLE notes ADD COLUMN owner VARCHAR(255) NOT NULL DEFAULT '';
