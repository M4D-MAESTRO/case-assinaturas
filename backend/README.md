<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    
</p>


## Pré Requisitos

- Docker
- NodeJS (LTS) 
- Yarn 

## Instalação

```bash
$ yarn
```

## Para executar o APP

```bash
$ docker-compose up -d
```
OBS: A primeira execução pode demorar devido a criação inicial de imagem e container Docker


## Banco de Dados

O banco de dados funciona com o conceito de migrations, uma vez iniciado, o pŕopria APP criará toda a estrutura de banco de dados.
Precisa apenas que a instância exista e esteja corretamente configurada

```bash
# Criar nova migration
$ yarn migration:create src/migrations/MIGRATION_NAME

# Executar migrations pendente
$ yarn migration:run

# Reverter uma migration
$ yarn migration:revert
```

## Envio de e-mails
```bash
 Você talvez precise configurar um novo usuário do Etheral para a correta utilização das funcionalidades de envio de e-mail.
Basta atualizar a propriedade "auth" do arquivo "mail-source.ts" localizada em "./src/config/"

  Você pode criar um novo usuário pelo link do Etheral: https://ethereal.email/create
```

## Containers
```bash
 Você talvez precise alterar os nomes dos services e containers no arquivo "docker-compose.yml" caso já tenha algum container executando com as nomeclaturas utilizadas.
  Se precisar, altere também na linha 22 do arquivo "data-source.ts" na pasta "./src/config/". E na linha 53 do arquivo app.module.ts localizado na pasta "./src"
```

## Portas
```bash
 Por padrão, a API é executada na porta 3000
 O Postgres na porta 5432
 E o Redis na porta 6379
 Certifique-se de altera-las, ou de liberar essas portas quando executando esse projeto.
```

## Contato

- Author - [Luis Henrique de C. Corrêa](https://www.linkedin.com/in/henriquedecastro-dev/)
- Website - [https://henrique-personal-site.web.app/#/home](https://henrique-personal-site.web.app/#/home)
- Instagram - [@henriquedecastro.dev](https://www.instagram.com/henriquedecastro.dev/)
- Linkedin - [@henriquedecastro-dev](https://www.linkedin.com/in/henriquedecastro-dev/)
