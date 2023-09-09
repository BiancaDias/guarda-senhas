# Guarda Senhas - Back

Navegar na internet pode ser uma atividade muito divertida, mas ao mesmo tempo, muito perigosa.Vemos todos os dias noticias de inumeros golpes virtuais. E como poderíamos nos proteger disso? 

Criar diferentes senhas para seus aplicativos e seguras, com varios caracteres diferentes é uma forma. Porém como memorizar tudo isso? Um arquivo no google docs com o nome de "senhas" não me parece muito seguro...

Pensando nisso, esse projeto serve como uma "chave mestra", onde você cria um login e salva as senhas que desejar de forma segura, sendo acessado apenas por você usando a chave única que você criou. E não só isso! Sabe aquela ideia de R$ 1 milhão que você teve que não pode esquecer e nem espalhar por ai? Você pode salvar como uma nota segura. E também aquele monte de cartões que você possui. Aqui fica tudo salvo e protegido.


## Tecnologias usadas

- O projeto segue o paradigma de orientação a objetos, feito em Nest.js;
- A criptografia do usuário é feita com bcrypt e das senhas guardadas é feita com cryptr;
- O sistema é todo testado com jest;
- O banco usado é o PostgresSQL e é gerenciado pelo Prisma.

segue abaixo sua documentação com o detalhamento de suas rotas:

https://guarda-senhas.onrender.com/api

Segue abaixo as instruções de configuração:

Certifiquse-se de ter as seguintes ferramentas instaladas e atualizadas no seu sistema: 

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


## Instalação

Siga estas etapas para configurar e executar o projeto localmente:

```bash
   git clone https://github.com/BiancaDias/guarda-senhas
   cd guarda-senhas
```

### 1 - Instalar as dependencias
```bash
  npm install
```
### 2 - Configurar a variavel de ambiente

Crie um arquivo .env na raiz do projeto com as variáveis de ambiente necessárias. Você pode usar o arquivo .env.example como um modelo.

### 3 - Configurar o banco de dados com o Prisma

Execute as seguintes etapas
```bash
  npx prisma generate
  npx prisma migrate dev
```

### 4 - Execute o projeto

```bash
  npm run start:dev
```
## Testes

Para execução de testes, certifique-se que você tenha na raiz do projeto um arquivo .env.test que contenha o seu banco de testes.

Para executá-los, use o comando 
```bash
  npm run test:e2e
```