--liquibase formatted sql

--changeset notes:1
CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    content TEXT
);
