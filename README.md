# Notes

A Spring Boot notes API with Keycloak authentication.

## Prerequisites

- Java 21
- Docker (for Keycloak + PostgreSQL)

## Quick Start

```bash
# Start Keycloak
docker compose up -d

# Set DB password
export DB_PASSWORD=yourpassword

# Run app
./gradlew bootRun
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DB_URL | jdbc:postgresql://localhost:5432/notes | Database URL |
| DB_USERNAME | postgres | Database user |
| DB_PASSWORD | postgres | Database password |
| KEYCLOAK_ISSUER_URI | http://localhost:8180/realms/notes | Keycloak realm URL |

## Services

| Service | Port | Credentials |
|---------|------|-------------|
| Keycloak | 8180 | admin/admin |
| App | 8080 | - |

## Running Tests

```bash
./gradlew test
```

## Getting a Token

```bash
curl -X POST http://localhost:8180/realms/notes/protocol/openid-connect/token \
  -d "grant_type=password" -d "client_id=notes-app" \
  -d "username=testuser" -d "password=password"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notes | List all notes |
| GET | /notes/{id} | Get note by ID |
| POST | /notes | Create note |
| PUT | /notes/{id} | Update note |
| DELETE | /notes/{id} | Delete note |

## Example API Call

```bash
TOKEN=$(curl -s -X POST http://localhost:8180/realms/notes/protocol/openid-connect/token \
  -d "grant_type=password" -d "client_id=notes-app" \
  -d "username=testuser" -d "password=password" | jq -r .access_token)

curl -H "Authorization: Bearer $TOKEN" localhost:8080/notes
```
