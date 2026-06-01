package com.gustavo.barbearia;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("Testes de API - (Endpoint de Serviços)")
public class TestEndpointServico {

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

    // TESTE DE ENDPOINT --> BUSCAR SERVIÇOS ATIVOS
    @Test
    public void testGetServicos() {
        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .log().all()
                .when()
                .get("/servicos")
                .then()
                .log().all()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("[0].id", notNullValue())
                .body("[0].nome", notNullValue())
                .body("[0].descricao", notNullValue())
                .body("[0].preco", notNullValue())
                .body("[0].tempoDuracao", notNullValue())
                .body("[0].ativo", notNullValue());
    }

    // TESTE DE ENDPOINT --> BUSCAR SERVIÇO POR ID ATIVO
    @Test
    public void testGetServicoPorId() {
        int postId = 2;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", postId)
                .log().all()
                .when()
                .get("/servicos/{id}")
                .then()
                .log().all()
                .statusCode(200)
                .body("id", equalTo(postId));
    }

    // TESTE DE ENDPOINT --> CRIAR SERVIÇO
    @Test
    public void testCriarServico() {
        String nome = "Corte + Barba";
        String descricao = "Serviço de Corte + Barba";
        BigDecimal preco = BigDecimal.valueOf(80.00);
        Integer tempoDuracao = 30;
        boolean ativo = true;

        String corpoRequisicao = String.format(
                "{\n" +
                        "  \"nome\": \"%s\"\n," +
                        "  \"descricao\": \"%s\"\n," +
                        "  \"preco\": \"%s\"\n," +
                        "  \"tempoDuracao\": \"%s\"\n," +
                        "  \"ativo\": %b" +
                        "}",
                nome, descricao, preco, tempoDuracao, ativo
        );

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body(corpoRequisicao)
                .log().all()
                .when()
                .post("/servicos")
                .then()
                .log().all()
                .statusCode(201);
    }

    // TESTE DE ENDPOINT --> EDITAR SERVIÇO
    @Test
    public void testAtualizarServico() {
        long id = 2;

        String nome = "Corte + Barba + Sobrancelha";
        String descricao = "";
        BigDecimal preco = BigDecimal.valueOf(85.00);
        Integer tempoDuracao = 40;
        boolean ativo = true;

        String corpoRequisicao = String.format(
                "{\n" +
                        "  \"nome\": \"%s\"\n," +
                        "  \"descricao\": \"%s\"\n," +
                        "  \"preco\": \"%s\"\n," +
                        "  \"tempoDuracao\": \"%s\"\n," +
                        "  \"ativo\": %b" +
                        "}",
                nome, descricao, preco, tempoDuracao, ativo
        );

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body(corpoRequisicao)
                .log().all()
                .when()
                .put("/servicos/" + id)
                .then()
                .log().all()
                .statusCode(200);
    }

    // TESTE DE ENDPOINT --> DESATIVAR SERVIÇO
    @Test
    public void testDeletarServico() {
        long id = 1;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", id)
                .log().all()
                .when()
                .delete("/servicos/{id}")
                .then()
                .log().all()
                .statusCode(204);
    }

}