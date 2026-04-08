@echo off
echo Setting JAVA_HOME...
set JAVA_HOME=C:\Program Files\Java\jdk-26
echo Starting KOLHER backend server on http://localhost:8081
echo H2 Console: http://localhost:8081/h2-console
"%~dp0mvnw.cmd" spring-boot:run
