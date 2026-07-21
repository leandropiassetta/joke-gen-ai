# Joke Gen

Uma aplicação full stack responsiva construída com Vue 3, TypeScript, AdonisJS e PostgreSQL.

A aplicação oferece uma experiência interativa e autenticada com piadas, apoiada por autenticação JWT, infraestrutura local baseada em Docker e testes automatizados no backend e no frontend.

## Visão Geral do Projeto

O Joke Gen conduz o usuário por um fluxo de humor dividido em quatro etapas. Após o login, o usuário passa pela tela inicial, pela tela triste e chega a uma tela interativa de piadas. Cada piada obtida aumenta o indicador de felicidade; ao atingir 100%, a aplicação exibe a tela feliz e reinicia a jornada.

As piadas são obtidas pelo backend AdonisJS por meio da API pública [Geek Jokes](https://geek-jokes.sameerkumar.website/api?format=json). Essa é uma integração HTTP convencional com uma API externa. O projeto não integra IA generativa, LLM, OpenAI, Anthropic, Claude ou qualquer outro modelo de linguagem. O robô e os textos relacionados à “felicidade da IA” fazem parte apenas do tema visual da interface.

## Principais Funcionalidades

- Layouts responsivos e imagens específicas para celulares, tablets, desktops e telas ultrawide
- Autenticação por e-mail e senha com JWT válido por uma hora
- Rotas protegidas no frontend e endpoints protegidos no backend
- Persistência e validação do token ao iniciar o frontend
- Fluxo de humor em quatro etapas: `/inicial`, `/triste`, `/poker-face` e `/feliz`
- Obtenção de piadas mediada pelo backend, com timeout e novas tentativas em caso de falha
- Gerenciamento dos estados de autenticação e humor com Pinia
- Persistência em PostgreSQL e migrations, incluindo um usuário de demonstração local
- Serviços de frontend, backend e banco de dados orquestrados com Docker Compose
- Testes unitários e funcionais no backend, além de testes unitários, de integração e E2E no frontend

## Stack Tecnológica

### Backend

- AdonisJS 6
- TypeScript
- PostgreSQL 15
- Lucid ORM
- VineJS para validação
- `jsonwebtoken` para geração e validação de JWTs
- Serviço de hash do AdonisJS com scrypt
- Axios
- Japa

### Frontend

- Vue 3 com Composition API
- TypeScript
- Pinia
- Vue Router
- Vuetify 3
- Axios
- Vite
- Vitest e Vue Test Utils
- Playwright

### Infraestrutura

- Docker
- Docker Compose
- Container PostgreSQL com health check
- Endpoint de saúde no backend e script de verificação do repositório
- Lockfiles do npm para instalações reproduzíveis

## Arquitetura

O frontend e o backend são aplicações separadas. O navegador nunca acessa diretamente o provedor externo de piadas.

```text
Navegador
  └─ SPA Vue 3 (porta 5173)
       └─ API REST AdonisJS (porta 3333)
            ├─ PostgreSQL (porta 5432)
            └─ Geek Jokes API (serviço HTTPS externo)
```

As principais rotas da API são:

| Método | Rota | Autenticação | Finalidade |
| --- | --- | --- | --- |
| `GET` | `/health` | Pública | Informa a disponibilidade do backend |
| `POST` | `/login` | Pública | Valida as credenciais e retorna um JWT |
| `GET` | `/me` | JWT Bearer | Retorna o usuário autenticado |
| `GET` | `/joke` | JWT Bearer | Obtém uma piada por meio do backend |

## Autenticação

O backend valida os dados de login com VineJS, busca o usuário pelo Lucid e verifica o hash scrypt da senha. Um login bem-sucedido retorna um JWT assinado com `APP_KEY` e configurado para expirar após uma hora.

O frontend armazena o token e o usuário serializado no `localStorage`. Um interceptor do Axios adiciona o cabeçalho `Authorization: Bearer <token>`. Ao iniciar, a aplicação chama `/me` para validar um token persistido. Uma resposta `401` remove os dados locais de autenticação e redireciona para `/login`. O Vue Router impede o acesso não autenticado às rotas do fluxo de humor.

A migration do banco de dados cria uma conta de demonstração para desenvolvimento local e testes automatizados:

- E-mail: `cliente@incuca.com.br`
- Senha: `seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.`

Essas credenciais são públicas e destinadas exclusivamente ao desenvolvimento local. Elas não devem ser reutilizadas em um ambiente publicado.

## Backend

O backend é uma API REST em AdonisJS organizada em controllers, services, middlewares, validators, um model do Lucid e migrations do banco de dados.

O `JokeService` acessa a Geek Jokes API com timeout de cinco segundos. Requisições com falha são repetidas até três vezes, com um intervalo crescente entre as tentativas. O controller autenticado de `/joke` retorna a piada em JSON ou uma resposta `500` quando o serviço externo não pode ser acessado.

A imagem Docker do backend utiliza um build multi-stage com Node.js 20. O entrypoint executa as migrations pendentes antes de iniciar o servidor compilado.

## Frontend

O frontend é uma SPA em Vue 3. As stores do Pinia gerenciam a sessão de autenticação e o progresso de humor. O Vue Router implementa o fluxo de navegação protegido, enquanto o Vuetify fornece a estrutura principal da aplicação e a configuração de ícones.

Na tela poker face, cada requisição bem-sucedida a `/joke` aumenta em 25% o indicador de felicidade. Ao atingir 100%, a aplicação navega para a tela feliz e retorna à tela inicial após cinco segundos. Fontes responsivas com `<picture>` e media queries fornecem layouts para celulares, tablets, desktops e telas ultrawide.

## Testes Automatizados

| Camada | Tipo de Teste | Ferramenta | Escopo Verificado |
| --- | --- | --- | --- |
| Backend | Unitário | Japa | Autenticação, JWT, obtenção de piadas e tentativas após falhas |
| Backend | Funcional | Japa API Client | Login, usuário atual, rota protegida de piadas e autorização HTTP |
| Frontend | Unitário | Vitest e Vue Test Utils | Stores do Pinia e comportamento das telas de login e piadas |
| Frontend | Integração | Vitest | Contratos simulados da API, estado de autenticação e guards de rotas em memória |
| Frontend | Ponta a ponta | Playwright | Login, navegação protegida, persistência do token, validação e viewports responsivos |

Os testes de integração do frontend utilizam respostas HTTP simuladas e não iniciam o backend real. O fluxo do Playwright depende de um backend funcional e de um banco PostgreSQL populado no endereço configurado por `VITE_API_URL`. Os testes funcionais de piadas do backend também dependem da Geek Jokes API externa.

Execute as suítes separadamente:

```bash
# Testes unitários do backend
cd backend
npm test -- unit

# Testes funcionais do backend
npm test -- functional

# Testes unitários do frontend
cd ../frontend
npm test -- --run tests/unit

# Testes de integração do frontend
npm test -- --run tests/integration

# Testes E2E do frontend
npm run test:e2e
```

Nenhum percentual de cobertura é informado porque o repositório não contém um resultado de cobertura versionado.

## Configuração com Docker

O Docker Compose inicia três serviços: `frontend`, `backend` e `postgres`. O PostgreSQL possui health check, e o backend aguarda o banco ficar saudável. O frontend é servido pelo servidor de desenvolvimento do Vite, enquanto o backend executa seu build compilado de produção e aplica as migrations na inicialização.

1. Clone o repositório:

   ```bash
   git clone https://github.com/leandropiassetta/joke-gen-ai.git
   cd joke-gen-ai
   ```

2. Crie o arquivo de ambiente na raiz:

   ```bash
   cp .env.example .env
   ```

3. Gere uma chave da aplicação sem gravá-la em um arquivo e defina o valor obtido como `APP_KEY` no `.env` da raiz. A CLI do projeto requer as dependências do backend instaladas no host:

   ```bash
   cd backend
   npm ci
   node ace generate:key --show
   cd ..
   ```

4. Revise os valores de `DB_USER`, `DB_PASSWORD` e `DB_DATABASE` no `.env`. Os valores copiados de `.env.example` são apenas exemplos para desenvolvimento local.

5. Valide e inicie os serviços:

   ```bash
   docker compose config --quiet
   docker compose up --build -d
   ```

6. Verifique o estado dos serviços:

   ```bash
   docker compose ps
   curl http://localhost:3333/health
   curl --head http://localhost:5173
   ```

   Com o usuário de banco definido no arquivo de exemplo, o script do repositório pode executar as três verificações:

   ```bash
   bash ./healthcheck.sh
   ```

7. Acesse `http://localhost:5173` e utilize a conta exclusiva para desenvolvimento documentada em [Autenticação](#autenticação).

Interrompa os containers sem excluir os dados do banco:

```bash
docker compose down
```

Para interromper os containers e remover o volume do PostgreSQL:

```bash
docker compose down -v
```

> `docker compose down -v` exclui permanentemente os dados locais do PostgreSQL armazenados no volume do Compose.

## Execução Local

A execução local requer Node.js 20, a mesma versão utilizada pelas imagens Docker, npm e PostgreSQL.

1. Instale as dependências do backend e configure seu ambiente:

   ```bash
   cd backend
   npm ci
   cp .env.example .env
   node ace generate:key
   ```

2. Defina `DB_HOST=localhost` em `backend/.env`, revise os demais valores do banco, crie o banco configurado e execute as migrations:

   ```bash
   node ace migration:run
   npm run dev
   ```

3. Em outro terminal, instale e inicie o frontend:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

O frontend fica disponível em `http://localhost:5173` e utiliza `http://localhost:3333` como URL padrão da API. Defina `VITE_API_URL` antes de iniciar o Vite caso o backend utilize outro endereço.

## Variáveis de Ambiente

### Docker Compose (`.env` na raiz do repositório)

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `APP_KEY` | Sim | Assina os JWTs e fornece a chave da aplicação AdonisJS |
| `DB_USER` | Sim | Usuário PostgreSQL compartilhado pelo banco e backend |
| `DB_PASSWORD` | Sim | Senha PostgreSQL compartilhada pelo banco e backend |
| `DB_DATABASE` | Sim | Nome do banco PostgreSQL compartilhado pelo banco e backend |

### Backend (`backend/.env` na execução sem Docker)

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `NODE_ENV` | Sim | `development`, `production` ou `test` |
| `PORT` | Sim | Porta do servidor HTTP |
| `HOST` | Sim | Endereço de bind do servidor HTTP |
| `APP_KEY` | Sim | Chave da aplicação AdonisJS e segredo para assinatura dos JWTs |
| `LOG_LEVEL` | Sim | Nível de log do backend |
| `DB_HOST` | Sim | Host do PostgreSQL |
| `DB_PORT` | Sim | Porta do PostgreSQL |
| `DB_USER` | Sim | Usuário do PostgreSQL |
| `DB_PASSWORD` | Não | Senha do PostgreSQL |
| `DB_DATABASE` | Sim | Nome do banco PostgreSQL |

### Frontend

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `VITE_API_URL` | Não | URL base do backend; o padrão é `http://localhost:3333` |

Nunca versione arquivos `.env`, chaves ou senhas de produção.

## Comandos Disponíveis

Execute os comandos do backend a partir de `backend/`:

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do AdonisJS com HMR |
| `npm run build` | Compila o backend para produção |
| `npm test` | Executa todas as suítes unitárias e funcionais do backend |
| `npm test -- unit` | Executa os testes unitários do backend |
| `npm test -- functional` | Executa os testes funcionais do backend |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Executa a verificação TypeScript sem gerar arquivos |
| `npm run format` | Formata os arquivos do backend com Prettier |

Execute os comandos do frontend a partir de `frontend/`:

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Executa o `vue-tsc` e gera o bundle de produção |
| `npm run preview` | Exibe uma prévia do bundle de produção |
| `npm test -- --run` | Executa uma vez todos os testes unitários e de integração do Vitest |
| `npm test -- --run tests/unit` | Executa uma vez os testes unitários do frontend |
| `npm test -- --run tests/integration` | Executa uma vez os testes de integração do frontend |
| `npm run test:watch` | Executa o Vitest em modo watch |
| `npm run test:ui` | Abre a interface do Vitest |
| `npm run test:coverage -- --run` | Executa o script de cobertura; requer a instalação prévia de `@vitest/coverage-v8` |
| `npm run test:e2e` | Executa o Playwright nos projetos desktop e mobile configurados |

O frontend não possui um script separado de lint. Seu build de produção executa a verificação TypeScript configurada por meio de `vue-tsc -b` antes de o Vite gerar o bundle. A verificação de tipos também pode ser executada diretamente com `npx vue-tsc -b`.

Builds de produção:

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Estrutura do Projeto

```text
.
├── backend/
│   ├── app/                 # Controllers, middlewares, models, services e validators
│   ├── config/              # Configuração da aplicação AdonisJS
│   ├── database/migrations/ # Schema PostgreSQL e migration do usuário de demonstração
│   ├── start/               # Registro de ambiente, middlewares e rotas
│   └── tests/               # Testes unitários e funcionais com Japa
├── frontend/
│   ├── public/              # Imagens responsivas
│   ├── src/                 # Views, components, stores, router e cliente da API
│   └── tests/               # Testes unitários/integração com Vitest e E2E com Playwright
├── docker-compose.yml       # Serviços de frontend, backend e PostgreSQL
├── healthcheck.sh           # Script local de verificação dos serviços
└── start.sh                 # Script auxiliar de build e inicialização do Compose
```

## Status da Implementação

O fluxo principal da aplicação está implementado: autenticação, rotas protegidas, obtenção de piadas, progresso de humor, telas responsivas, migrations do PostgreSQL, infraestrutura com Docker Compose e suítes de testes automatizados estão presentes no repositório.

A obtenção de piadas em tempo de execução depende do acesso à Geek Jokes API externa. Os testes funcionais do backend dependem do banco PostgreSQL configurado e do usuário de demonstração criado pelas migrations. Os testes do Playwright dependem do backend e do banco em execução. Não existe integração com IA generativa ou modelos de linguagem.

## Autor

[Leandro Piasseta](https://github.com/leandropiassetta)
