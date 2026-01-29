#!/bin/sh

# Aguarda o banco estar pronto (opcional, mas recomendado checkar logs ou usar wait-for-it)
echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
# Executa o seed usando node e o ts-node (ou via script configurado no package.json se funcionar no container)
# Como estamos no container de produção (runner), não temos ts-node instalado globalmente.
# O Dockerfile copia prisma/, então podemos usar o script seed definido no package.json se as dependencias dev estiverem la,
# MAS em prod (runner) só temos deps de prod.
# O seed.ts precisa ser executado. Podemos usar 'tsx' se estiver nas deps de prod, ou compilar o seed.
# Uma abordagem comum para prod é ter uma migration que insere dados ou um script JS.
# Vamos tentar rodar via npx tsx se possível, ou assumir que o usuário vai rodar isso localmente antes.

# Melhor abordagem para este ambiente "fake data presentation":
# O usuário quer apresentar.
# Vamos usar npx prisma db seed que invoca o comando do package.json.
# Se falhar por falta de tsx/ts-node, o usuário será avisado no guia.
npx prisma db seed
