FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml ./
COPY lib ./lib
COPY src ./src
COPY Config.properties ./Config.properties

RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN mkdir -p /app/logs

COPY --from=builder /build/target/NgocRongOnline.jar /app/app.jar
COPY Config.properties /app/Config.properties
COPY run.sh /app/run.sh
COPY restart_server.sh /app/restart_server.sh
COPY scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/run.sh /app/restart_server.sh /app/entrypoint.sh

EXPOSE 14445
ENTRYPOINT ["/app/entrypoint.sh"]
