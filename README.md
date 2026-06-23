# Sniplink

Encurtador de URLs com analytics. Cole uma URL longa, receba um link curto — e
quando alguém clica, o redirecionamento acontece em milissegundos enquanto um
evento de clique é processado de forma assíncrona para gerar métricas (cliques
por dia, dispositivos, navegadores, países).

A arquitetura é baseada em microsserviços: um serviço encurta e redireciona,
outro processa analytics, comunicando-se via RabbitMQ. Cada serviço tem seu
próprio banco PostgreSQL.

## Como clonar

```bash
git clone https://github.com/gabrielportodev/sniplink.git
cd sniplink
```

## Como rodar

### Pré-requisitos

- Java 21
- PostgreSQL (databases `sniplink_short_db` e `sniplink_analytics_db` — um por serviço)
- RabbitMQ
- Base GeoLite2 (`.mmdb` da MaxMind) para o `analytics-service`
- Node.js 22 (para o frontend)

### short-service

```bash
cd services/short-service

# 1. crie sua config local a partir do exemplo
cp src/main/resources/application.properties.example src/main/resources/application.properties
# 2. preencha usuário e senha do PostgreSQL no arquivo criado

# 3. suba o serviço (porta 8082)
./mvnw spring-boot:run
```

Outros comandos úteis:

```bash
./mvnw test            # roda os testes
./mvnw clean package   # gera o JAR em target/
```

### analytics-service

Consome os eventos de clique do RabbitMQ, resolve GeoIP, parseia o User-Agent,
persiste no PostgreSQL e expõe a API de métricas (`/api/analytics/...`) que o
dashboard consome.

```bash
cd services/analytics-service

# 1. crie sua config local a partir do exemplo
cp src/main/resources/application.properties.example src/main/resources/application.properties
# 2. preencha PostgreSQL (sniplink_analytics_db), RabbitMQ e o caminho do .mmdb (GeoLite2)

# 3. suba o serviço (porta 8083)
./mvnw spring-boot:run
```

> O serviço já tem o scaffolding do Spring Boot; o consumer, as queries de
> agregação e os endpoints REST ainda serão implementados.

### frontend

Dashboard em **Angular 22** (standalone components, Tailwind CSS, ng2-charts).

```bash
cd frontend

npm install
npm start              # ng serve — http://localhost:4200
```

A URL da API fica em `src/environments/environment.ts` (aponta para o
`short-service` em `http://localhost:8082/api`). Veja o
[README do frontend](frontend/README.md) para mais detalhes.
