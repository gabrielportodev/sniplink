# Sniplink

Encurtador de URLs com analytics. Cole uma URL longa, receba um link curto — e
quando alguém clica, o redirecionamento acontece em milissegundos enquanto um
evento de clique é processado de forma assíncrona para gerar métricas (cliques
por dia, dispositivos, navegadores, países).

A arquitetura é baseada em microsserviços: um serviço encurta e redireciona,
outro processa analytics, comunicando-se via RabbitMQ. Cada serviço tem seu
próprio banco PostgreSQL.

> **Status:** em desenvolvimento. No momento apenas o `short-service` está no
> repositório. O `analytics-service` e o `frontend` ainda serão adicionados.

## Como clonar

```bash
git clone https://github.com/gabrielportodev/sniplink.git
cd sniplink
```

## Como rodar

### Pré-requisitos

- Java 21
- PostgreSQL (database `sniplink_short_db`)
- RabbitMQ

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
