#!/bin/sh

npx prisma generate
npx prisma migrate dev

npm run start:dev
