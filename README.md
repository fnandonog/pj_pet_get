# API Get A Pet

API de adoção de pets feita em Node.js com Express, Sequelize e MySQL.
O usuário se cadastra, faz login e pode cadastrar pets para adoção.

## O que tem na API

- Cadastro de usuário com validação e senha criptografada (bcrypt)
- Login com token JWT (vale 1 dia)
- Rotas protegidas por token (middleware verifyToken)
- Ver, listar, editar e apagar usuário (só pode mexer no próprio perfil)
- CRUD de pets: cadastrar, listar, ver um, editar e remover
- Adoção: agendar visita, ver minhas adoções e concluir adoção
- Validação dos dados com express-validator
- Dados do banco e chave do token no arquivo .env

## Regras de negócio

- Ninguém altera dados de outro usuário (403)
- Só o dono edita ou remove o pet (403)
- Não dá para agendar visita no próprio pet (422)
- Só uma pessoa agenda visita por pet (422)
- Só o dono conclui a adoção, e só se alguém agendou visita (403 / 422)
- Pet adotado não pode ser editado nem receber visita (422)
- O "available" do pet só muda quando conclui a adoção (não dá para mandar pelo body)
- E-mail não pode repetir e a senha nunca volta nas respostas

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
| GET | /pets/myadoptions 🔒 | pets em que eu agendei visita |
| PATCH | /pets/schedule/:id 🔒 | agendar visita (devolve o telefone do dono) |
| PATCH | /pets/conclude/:id 🔒 | concluir adoção (só o dono) |

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
