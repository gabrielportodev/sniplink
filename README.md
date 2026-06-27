# Sniplink

**Aplicação no ar:** https://sniplink.gabrielporto.me

Encurtador de URLs com analytics. Cole uma URL longa, receba um link curto — e
quando alguém clica, o redirecionamento acontece em milissegundos enquanto um
evento de clique é processado de forma assíncrona para gerar métricas (total de
cliques, cliques por dia, dispositivos, navegadores, países).

O detalhe legal da arquitetura é a **comunicação assíncrona**: o serviço de
redirecionamento não espera ninguém persistir nada — ele publica uma mensagem no
RabbitMQ e responde o redirect na hora. O serviço de analytics consome a fila no
seu próprio ritmo.

## Arquitetura

Monorepo com dois microsserviços e um frontend, cada parte com sua
responsabilidade:

```
sniplink/
├── services/
│   ├── short-service/        # encurtar + redirecionar + auth (Spring Boot)
│   └── analytics-service/    # consumir a fila + métricas (Spring Boot)
└── frontend/                 # dashboard (Angular)
```

- **short-service** (porta `8082`) — encurta URLs (com suporte a *alias*
  customizado), redireciona e cuida da autenticação (JWT em cookie `HttpOnly`,
  invisível ao JS). Tem rate limiting na criação de links e proteção global por
  IP. A cada clique publica um evento no RabbitMQ. Banco próprio:
  `sniplink_short_db`.
- **analytics-service** (porta `8083`) — consome a fila de cliques, resolve o IP
  em país/cidade (API pública `ip-api.com`), parseia o User-Agent (Yauaa) e
  guarda tudo. Expõe a API REST de métricas que o dashboard consome. Banco
  próprio: `sniplink_analytics_db`. É um serviço interno, sem auth.
- **frontend** (porta `4200`) — dashboard em Angular com as telas de login,
  encurtar links e ver os gráficos de analytics.

Os dois serviços conversam só via RabbitMQ e cada um tem seu próprio PostgreSQL —
nada de banco compartilhado.

### Fluxo na prática

1. Alguém acessa `sniplink.gabrielporto.me/abc123`.
2. O short-service busca a URL original no Postgres pelo `shortCode`.
3. Publica um evento de clique no RabbitMQ (shortCode, IP, User-Agent, timestamp).
4. Responde o redirect — tudo em milissegundos.
5. O analytics-service consome a fila, resolve o GeoIP, parseia o User-Agent e
   persiste o clique.
6. O dashboard consome a API do analytics-service para montar os gráficos.

## Funcionalidades

- Encurtar URLs com `shortCode` gerado automaticamente ou *alias* customizado.
- Redirecionamento (302) público e instantâneo, com publicação assíncrona do
  clique no RabbitMQ.
- Autenticação de usuários (registro/login) com JWT entregue em cookie
  `HttpOnly`; cada link pertence ao seu dono.
- Rate limiting na criação de links e proteção global por IP.
- Analytics por link: total de cliques, cliques por dia, distribuição por
  navegador, dispositivo e país — filtráveis por período (`?days=`).
- Dashboard em Angular com gráficos interativos.

## Stack

- **Backend:** Java 21, Spring Boot 3.5, Maven, Spring Data JPA, Spring AMQP,
  Spring Security + JWT (jjwt), Spring Validation, Lombok.
- **Mensageria:** RabbitMQ.
- **Banco:** PostgreSQL (um por serviço).
- **GeoIP / User-Agent:** `ip-api.com` + Yauaa.
- **Frontend:** Angular 22 (standalone components), TypeScript, Tailwind CSS v4,
  ng2-charts + chart.js.
- **Infra:** Docker + Docker Compose, Nginx servindo o frontend e fazendo proxy
  para os serviços.

## Como rodar com Docker (recomendado)

Sobe tudo de uma vez: os 2 Postgres, o RabbitMQ e os 3 apps.

```bash
git clone https://github.com/gabrielportodev/sniplink.git
cd sniplink

# 1. crie o .env com as credenciais do Postgres
cp .env.example .env
# 2. preencha POSTGRES_USER e POSTGRES_PASSWORD

# 3. suba tudo
docker compose up --build
```

Pronto:

- Frontend → http://localhost:4200
- short-service → http://localhost:8082
- analytics-service → http://localhost:8083
- RabbitMQ (painel de gerenciamento) → http://localhost:15672 (`guest`/`guest`)

## Como rodar manualmente (sem Docker)

### Pré-requisitos

- Java 21
- Node.js 22 (para o frontend)
- PostgreSQL (databases `sniplink_short_db` e `sniplink_analytics_db` — um por serviço)
- RabbitMQ

### short-service

```bash
cd services/short-service

# crie sua config local a partir do exemplo e preencha Postgres/RabbitMQ
cp src/main/resources/application.properties.example src/main/resources/application.properties

./mvnw spring-boot:run     # sobe na porta 8082
```

Outros comandos: `./mvnw test` (testes) e `./mvnw clean package` (gera o JAR).

### analytics-service

```bash
cd services/analytics-service

# crie sua config local a partir do exemplo e preencha Postgres/RabbitMQ
cp src/main/resources/application.properties.example src/main/resources/application.properties

./mvnw spring-boot:run     # sobe na porta 8083
```

Mesmos comandos de teste/build do short-service. O GeoIP usa a API pública
`ip-api.com`, então não precisa de chave nem de base local.

### frontend

```bash
cd frontend

npm install
npm start                  # ng serve — http://localhost:4200
```

A URL dos serviços fica em `src/environments/environment.ts` (`apiUrl` aponta para
o short-service e `analyticsApiUrl` para o analytics-service).
