## Run Docker

```bash
$ docker compose up -d --build
```

## Init Database
```bash
$ docker exec -it app sh
$ yarn prisma migrate deploy
```

## Logs on Docker
```bash
$ docker compose logs -f app
```

## Run local

```bash
$ yarn install
```

```bash
$ npx prisma generate
$ npx prisma migrate dev --init
```

```bash
$ yarn dev
```