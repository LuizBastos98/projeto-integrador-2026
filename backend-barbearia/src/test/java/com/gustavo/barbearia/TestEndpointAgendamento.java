package com.gustavo.barbearia;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("Testes de API - (Endpoint de Agendamentos)")
public class TestEndpointAgendamento {

    private static final String BASE_URL = "http://localhost:8080";

    @BeforeAll
    public static void setup() {
        RestAssured.baseURI = BASE_URL;
    }

    /*
    getToken(): Ele é responsável por autenticar no endpoint /auth/login e obter o token JWT
    ele é utilizado para autorizar as requisições
    given(): Ele é utilizado em todos os testes e é necessário enviar o token no header:
    Authorization: Bearer <TOKEN GERADO>
    Caso o header não seja enviado, a API retornará 401 (Unauthorized) ou 403 (Forbidden),
    impedindo a execução correta dos testes.
    */

    private String getToken() {
        String loginBody = """
        {
          "email": "administrador@barbearia.com",
          "senha": "administrador"
        }
    """;

        return given()
                .contentType("application/json")
                .body(loginBody)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .path("token");
    }

    // TESTE DE ENDPOINT --> BUSCAR AGENDAMENTOS ATIVOS
    @Test
    public void testGetAgendamentos() {
        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .log().all()
                .when()
                .get("/agendamentos")
                .then()
                .log().all()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("[0].id", notNullValue())
                .body("[0].nomeCliente", notNullValue())
                .body("[0].nomeBarbeiro", notNullValue())
                .body("[0].nomeServico", notNullValue())
                .body("[0].horaInicial", notNullValue())
                .body("[0].horaFinal", notNullValue())
                .body("[0].status", notNullValue());
    }

    // TESTE DE ENDPOINT --> BUSCAR AGENDAMENTO POR ID ATIVO
    @Test
    public void testGetAgendamentoPorId() {
        int postId = 1;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", postId)
                .log().all()
                .when()
                .get("/agendamentos/{id}")
                .then()
                .log().all()
                .statusCode(200)
                .body("id", equalTo(postId));
    }

    // TESTE DE ENDPOINT --> CRIAR AGENDAMENTO
    @Test
    public void testCriarAgendamento() {
        long clienteId = 52;
        long barbeiroId = 4;
        long servicoId = 1;
        LocalDateTime horaInicial = LocalDateTime.now()
                .plusDays(1)
                .withHour(14)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        String corpoRequisicao = String.format(
                "{\n" +
                        "  \"clienteId\": \"%d\"\n," +
                        "  \"barbeiroId\": \"%d\"\n," +
                        "  \"servicoId\": \"%d\"\n," +
                        "  \"horaInicial\": \"%s\"" +
                        "}",
                clienteId, barbeiroId, servicoId, horaInicial.toString()
        );

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body(corpoRequisicao)
                .log().all()
                .when()
                .post("/agendamentos")
                .then()
                .log().all()
                .statusCode(201);
    }

    // TESTE DE ENDPOINT --> DESATIVAR AGENDAMENTO
    @Test
    public void testCancelarAgendamento() {
        long id = 1;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", id)
                .log().all()
                .when()
                .delete("/agendamentos/{id}")
                .then()
                .log().all()
                .statusCode(204);
    }

}