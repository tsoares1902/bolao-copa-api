# bolao-copa-api

O **bolao-copa-api** gerencia usuários e toda lógica do bolão da copa do mundo.

## Conteúdo:

- **[Stack](#stack)**
- **[Instalação](#installation)**
- **[Variáveis de Ambiente](#environment)**
- **[Rodando com Docker](#running)**
- **[Testes](#tests)**
- **[Documentação](#documentation)**
- **[Projetos Relacionados](#tests)**

## Stack <a name="stack"></a>

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)

## Instalação <a name="installation"></a>

Clone o repositório no [GitHub](https://github.com/)

```
$ git clone git@github.com:tsoares1902/bolao-copa-api.git
```

Acesse o diretorio da aplicação:

```bash
$ cd bolao-copa-api/
```

## Variáveis de Ambiente <a name="environment"></a>

Crie um arquivo `.env` ou copie o `.env.example`.

```
# Application host URL:
BOLAO_COPA_API_URL=http://localhost:4000

# Host port bound to the API container:
APPLICATION_BIND_PORT=4000

# API container port:
APPLICATION_PORT=3000

# MongoDB database URI:
DATABASE_URI=mongodb://database:27017/bolao-copa

# MongoDB database schema:
DATABASE_NAME=bolao-copa

# MongoDB host bind port:
DATABASE_BIND_PORT=27027

# MongoDB container port:
DATABASE_PORT=27017
```

## Rodando com Docker <a name="running"></a>

Instale as dependencias do [Node.js](https://nodejs.org/) com [npm](https://www.npmjs.com/):

```bash
$ npm install
```

Tenha certeza que você tem o [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

```
docker-compose up -d --build
```

## Testes <a name="tests"></a>

O projeto é coberto por testes untários que garantem a integridade da use-case.

Para rodar os testes unitários:

```
npm run test
```

Para gerar o coverage dos testes unitários:

```
npm run test:cov
```

## Documentação <a name="documentation"></a>

A documentação interativa da API está disponível via [Swagger](https://swagger.io/).

```
http://localhost:4000/docs
```

## Projetos Relacionados <a name="related"></a>

Está API faz parte de um ecossitema do bolao:

[bolao-copa-site](https://github.com/tsoares1902/bolao-copa-site) -> Site do sistema de bolão.

[bolao-copa-dashboard](https://github.com/tsoares1902/bolao-copa-dashboard) -> Dashboard do sistema de bolao.
