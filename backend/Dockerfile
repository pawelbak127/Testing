#
# Build stage
#
FROM openjdk:23 AS build
ENV HOME=/usr/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . $HOME
RUN --mount=type=cache,target=/root/.m2 ./mvnw -f $HOME/pom.xml clean package -DskipTests

#
# Package stage
#
FROM openjdk:23
ARG JAR_FILE=/usr/app/target/*.jar
COPY --from=build $JAR_FILE /app/app.jar
EXPOSE 8080
ENTRYPOINT java -jar /app/app.jar