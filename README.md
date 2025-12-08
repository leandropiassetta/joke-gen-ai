# 🎭 joke-gen-ai  
### Desafio técnico desenvolvido para o processo seletivo da Incuca  
*(onde até uma SPA tem crises existenciais — e não do tipo que vendem massagem)*

Uma aplicação cujo humor muda mais do que desenvolvedor esperando o deploy terminar — e tudo isso alimentado por piadas geek servidas direto do backend.

📘 **Read this in English:** [README.en.md](./README.en.md)

---

## 🚀 Tecnologias Utilizadas  
*Porque até para criar uma aplicação emocionalmente instável, precisamos de ferramentas estáveis.*

### **Frontend**
- **Vue.js 3** (Composition API)  
- **Pinia** — gerenciamento de estado  
- **Vue Router** — rotas e transições de humor  
- **Vuetify** — componentes de UI  
- **Axios** — comunicação com o backend  
- **ESLint** — análise estática  
- **Jest** — testes automatizados (planejados)  

### **Backend**
- **AdonisJS 6** — API REST  
- **jsonwebtoken** — autenticação JWT  
- **Lucid ORM** — migrations e modelos  
- **Migração** para criação do usuário inicial  
- **Axios** — consumo da Geek Joke API  
- **Japa** — test runner nativo  
- **Docker** — ambiente unificado (planejado)

---

## 🎯 Objetivo  
*(Porque toda SPA merece uma jornada emocional bem definida.)*

Criar uma SPA cujo humor muda conforme a interação do usuário, usando piadas da **Geek Joke API**, sempre mediada pelo backend.

---

## 🎭 Fluxo de Humor 
*(Sim, até as rotas têm humor — e não, isso não é metáfora.)*

| Rota          | Humor |
|---------------|--------|
| `/inicial`    | 😐 Neutro |
| `/triste`     | 😭 Triste |
| `/poker-face` | 😐 Poker Face + modal de piada |
| `/feliz`      | 😁 Feliz |

---

## 🧠 Fluxo Resumido
*(Para quem gosta de entender o emocional antes de interagir.)*

1. Usuário faz login → `/inicial`  
2. Primeiro clique → `/triste`  
3. Clique na tela triste → `/poker-face`  
   - Backend busca uma piada  
   - Modal exibe a piada e melhora o humor  
4. Modal só fecha quando a tela chegar em `/feliz`  
5. Fechando → retorna a `/inicial`  

🔒 **Importante:** O frontend **não** acessa a Geek Joke API diretamente — tudo passa pelo backend, conforme exigido.

API: https://github.com/sameerkumar18/geek-joke-api

---

## 🔑 Autenticação
*(Porque até o humor da SPA exige credenciais válidas.)*

- Autenticação com **JWT**  
- Token em `sessionStorage`  
- Rotas internas protegidas  

Usuário criado via migração:

- **Email:** `cliente@incuca.com.br`  
- **Senha:** `seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.`  

---

## 🗂 Estrutura 
*(Organização é importante, até quando o aplicativo não sabe que humor vai ter amanhã.)*

Será documentada ao final do desenvolvimento.  
Frontend e backend são totalmente desacoplados.

---

## 🚧 Como Rodar  

As instruções serão detalhadas após a implementação completa.

Objetivo final:

```bash
docker-compose up
```

---

## 📡 API da Aplicação 
*O backend faz a ponte — e a piada — acontecer.*

### **POST /login**
- Valida credenciais  
- Retorna JWT  
- Salva sessão no frontend  

### **GET /joke** *(rota autenticada)*
- Exige autenticação  
- Backend faz proxy para a Geek Joke API  
- Retorna uma piada aleatória para a SPA  

---

## 🧠 Decisões Técnicas  
*(Momento sério.)*

- AdonisJS 6 escolhido por sua arquitetura clara, CLI eficiente e sistema robusto de migrações.  
- JWT implementado com `jsonwebtoken`, garantindo controle total sobre o fluxo.  
- Vue 3 + Pinia oferecem estado global reativo, previsível e escalável.  
- Vuetify possibilita criação rápida de UI com componentes padronizados.  
- Japa integra-se naturalmente ao ecossistema AdonisJS para testes.  
- Backend funciona como intermediário obrigatório entre SPA e Geek Joke API.  
- Separação clara entre frontend e backend garante modularidade e boas práticas.  

> **Nota:** O projeto está em desenvolvimento — decisões podem evoluir e serão refletidas neste README.

---

## ⏱ Estimativa  

Estimativa inicial de **2 a 3 dias**, cobrindo:

- Backend + JWT  
- Migrations + usuário inicial  
- SPA completa com todas as rotas e mudanças de humor  
- Integração com Geek Joke API  
- Testes básicos  
- Documentação  

---

## 📝 Considerações Finais  

Este projeto foi construído com foco em:

- Clareza  
- Organização  
- Boas práticas  
- Experiência do usuário  
- Aderência total ao desafio  

Este README será atualizado conforme novas etapas forem concluídas.

---
