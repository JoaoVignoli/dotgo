# Estágio 1: Compilação (Build)
# Usamos uma imagem com Maven e JDK 21 para compilar o projeto.
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
# Copia só o pom.xml primeiro para usar o cache de dependências do Docker
COPY pom.xml .
RUN mvn dependency:go-offline
# Agora copia o resto do código fonte
COPY src ./src
# Compila e empacota a aplicação, pulando os testes (eles rodam no Actions)
RUN mvn package -DskipTests

# Estágio 2: Execução (Run)
# Usamos uma imagem leve, apenas com o Java (JRE), para rodar a aplicação.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copia o arquivo .jar gerado no estágio anterior para a imagem final
COPY --from=builder /app/target/dotgo-0.0.1-SNAPSHOT.jar app.jar
# Expõe a porta 8080, que é a padrão do Spring Boot
EXPOSE 8080
# Comando que inicia a aplicação quando o container sobe
ENTRYPOINT ["java", "-jar", "app.jar"]
