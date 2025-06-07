## Database Schema and Migrations

This project uses [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) to manage database schema changes and migrations.

### Running Pending Migrations

To apply any pending migrations, run:

```sh
npx prisma migrate dev
```

### Making changes to the database schema

1. Modify the [`schema.prisma`](./prisma/schema.prisma) file to update the database schema.
2. Generate a new migration file by running:

```sh
npx prisma migrate dev --create-only
```

3. Apply the new migration to the database by running:

```sh
npx prisma migrate dev
```

## Testing

**Naming convention of test files**

Integration Tests

-   **Format:** `<filename>.integration.ts`
-   **Example:** `user.integration.ts`

Unit Tests

-   **Format:** `<filename>.unit.ts`
-   **Example:** `user.unit.ts`

</br>

**Running the tests**

```bash
# Unit tests
$ npm run test:unit

# Integration tests
$ npm run test:integration
```
