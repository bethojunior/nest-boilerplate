
## 🚀 Release 1.0 – Nest Boilerplate

Apresentamos a versão 1.0 do **Nest Boilerplate**, uma base sólida para o desenvolvimento de aplicações backend utilizando **NestJS**. Este projeto foi cuidadosamente estruturado para oferecer uma arquitetura escalável, modular e alinhada com as melhores práticas do mercado.

### 🧩 Principais Recursos e Funcionalidades

- 🔁 **Arquitetura Modular**: Organização do código em módulos independentes, facilitando a manutenção e escalabilidade da aplicação.
- ⚙️ **Integração com Prisma ORM**: Configuração pronta para uso com o Prisma, permitindo uma interação eficiente e tipada com o banco de dados.
- 🛡️ **Autenticação com JWT**: Implementação de autenticação baseada em JSON Web Tokens, garantindo segurança nas rotas protegidas.
- 💾 **Suporte a Redis**: Integração com o Redis para gerenciamento de cache, sessões e outras funcionalidades que demandam armazenamento em memória.
- 📁 **Estrutura de Pastas Organizada**: Separação clara entre `apps`, `core` e `shared`, promovendo uma melhor organização e reutilização de código.
- 🧪 **Configuração para Testes Automatizados**: Ambiente preparado para a escrita e execução de testes, assegurando a qualidade do código.
- 🧭 **Gerenciamento de Variáveis de Ambiente**: Utilização de arquivos `.env` com validação via Zod, garantindo que todas as variáveis necessárias estejam corretamente definidas.
- 🐳 **Suporte a Docker**: Arquivos `Dockerfile` e `docker-compose.yml` inclusos, facilitando a containerização e o deploy da aplicação.

---

### 🚀 Como Iniciar o Projeto

1. Clone o repositório:  
   `git clone https://github.com/bethojunior/nest-boilerplate && cd nest-boilerplate`

2. Instale as dependências:  
   `yarn install`

3. Configure as variáveis de ambiente:  
   `cp .env.exemple .env`

4. Gere os arquivos do Prisma:  
   `npx prisma generate`

5. Execute as migrações do banco de dados:  
   `npx prisma migrate dev --name init`

6. Inicie a aplicação:  
   `yarn dev`

---

### 🐳 Executando com Docker

Para rodar a aplicação utilizando Docker:

```bash
docker compose up -d --build
```

Após o container estar em execução, aplique as migrações:

```bash
docker exec -it app sh
yarn prisma migrate deploy
```

Para visualizar os logs:

```bash
docker compose logs -f app
```

---

Este boilerplate foi desenvolvido com o objetivo de acelerar o processo de desenvolvimento, fornecendo uma base robusta e pronta para produção. Contribuições são bem-vindas!
