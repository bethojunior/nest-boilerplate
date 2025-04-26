#!/bin/bash
echo "Aplicando migrações do Prisma..."
npx prisma migrate deploy
echo "Migrações aplicadas. Iniciando a aplicação..."
yarn start:prod