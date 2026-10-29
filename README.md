# API Get A Pet

API de adoção de pets feita em Node.js com Express, Sequelize e MySQL.
O usuário se cadastra, faz login e pode cadastrar pets para adoção.

## O que já foi feito (50%)

- Cadastro de usuário com validação e senha criptografada (bcrypt)
- Login com token JWT (vale 1 dia)
- Rotas protegidas por token (middleware verifyToken)
- Ver, listar, editar e apagar usuário (só pode mexer no próprio perfil)
- CRUD de pets: cadastrar, listar, ver um, editar e remover (só o dono pode editar e remover)
- Validação dos dados com express-validator
- Dados do banco e chave do token no arquivo .env

Falta fazer: upload de imagem, agendar visita e concluir adoção.

## Como rodar

1. Criar o banco no MySQL: `CREATE DATABASE db_get_a_pet;`
2. Conferir os dados do banco e a CHAVETOKEN no arquivo `.env` (tem um modelo no `.env.example`)
3. Instalar os pacotes: `npm install`
4. Rodar: `npm start`

A API roda em `http://localhost:3030`. As tabelas são criadas sozinhas pelo `conn.sync()`.

## Rotas

As rotas com 🔒 precisam do token no header:
`Authorization: Bearer SEU_TOKEN`

### Usuários

| Método | Rota | O que faz |
|---|---|---|
| POST | /users/register | cadastrar usuário |
| POST | /users/login | fazer login e receber o token |
| GET | /users/checkuser 🔒 | ver o usuário logado |
| GET | /users 🔒 | listar todos os usuários |
| GET | /users/:id | ver um usuário |
| PATCH | /users/edit/:id 🔒 | editar o próprio perfil |
| DELETE | /users/:id 🔒 | apagar a própria conta |

Exemplo de cadastro:

```json
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "123456",
  "confirmpassword": "123456",
  "phone": "11999999999"
}
```

### Pets

| Método | Rota | O que faz |
|---|---|---|
| POST | /pets/create 🔒 | cadastrar pet |
| GET | /pets | listar todos os pets |
| GET | /pets/mypets 🔒 | listar os meus pets |
| GET | /pets/:id | ver um pet |
| PATCH | /pets/:id 🔒 | editar pet (só o dono) |
| DELETE | /pets/:id 🔒 | remover pet (só o dono) |

Exemplo de cadastro de pet:

```json
{
  "name": "Rex",
  "age": 3,
  "weight": 12.5,
  "color": "Caramelo",
  "image": "rex.jpg"
}
```

## Respostas

- 200 - deu certo
- 201 - cadastrado com sucesso
- 401 - sem token ou token inválido
- 403 - não tem permissão (não é o dono)
- 404 - não encontrado
- 422 - dados inválidos ou faltando
- 500 - erro no servidor
