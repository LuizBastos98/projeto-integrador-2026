package com.gustavo.barbearia;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("Testes de API - (Endpoint de Usuários)")
public class TestEndpointUsuarios {

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

    // TESTE DE ENDPOINT --> BUSCAR USUÁRIOS ATIVOS
    @Test
    public void testGetUsuarios() {
        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .log().all()
                .when()
                .get("/usuarios")
                .then()
                .log().all()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("[0].id", notNullValue())
                .body("[0].nome", notNullValue())
                .body("[0].email", notNullValue())
                .body("[0].telefone", notNullValue())
                .body("[0].ativo", notNullValue())
                .body("[0].tipoUsuario", notNullValue());
    }

    // TESTE DE ENDPOINT --> BUSCAR USUÁRIO POR ID ATIVO
    @Test
    public void testGetUsuarioPorId() {
        int postId = 4;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", postId)
                .log().all()
                .when()
                .get("/usuarios/{id}")
                .then()
                .log().all()
                .statusCode(200)
                .body("id", equalTo(postId));
    }

    // TESTE DE ENDPOINT --> CRIAR USUÁRIO
    @Test
    public void testCriarUsuario() {
        String nome = "Lucas de Souza Ribeiro";
        String email = "lucasribeiro@barbearia.com";
        String senha = "123456789";
        String telefone = "62994127389";
        String tipoUsuario = "BARBEIRO";

        String corpoRequisicao = String.format(
                "{\n" +
                        "  \"nome\": \"%s\"\n," +
                        "  \"email\": \"%s\"\n," +
                        "  \"senha\": \"%s\"\n," +
                        "  \"telefone\": \"%s\"\n," +
                        "  \"tipoUsuario\": \"%s\"\n" +
                        "}",
                nome, email, senha, telefone, tipoUsuario
        );

        given()
                .contentType("application/json")
                .body(corpoRequisicao)
                .log().all()
                .when()
                .post("/usuarios")
                .then()
                .log().all()
                .statusCode(201);
    }

    // TESTE DE ENDPOINT --> EDITAR USUÁRIO
    @Test
    public void testAtualizarUsuario() {
        long id = 2;

        String nome = "Pedro da Silva Albuquerque";
        String email = "pedroalbuquerque@barbearia.com";
        String senha = "987654321";
        String telefone = "62994897425";
        String tipoUsuario = "ADMINISTRADOR";

        String corpoRequisicao = String.format(
                "{\n" +
                        "  \"nome\": \"%s\"\n," +
                        "  \"email\": \"%s\"\n," +
                        "  \"senha\": \"%s\"\n," +
                        "  \"telefone\": \"%s\"\n," +
                        "  \"tipoUsuario\": \"%s\"\n" +
                        "}",
                nome, email, senha, telefone, tipoUsuario
        );

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body(corpoRequisicao)
                .log().all()
                .when()
                .put("/usuarios/" + id)
                .then()
                .log().all()
                .statusCode(200);
    }

    // TESTE DE ENDPOINT --> DESATIVAR USUÁRIO
    @Test
    public void testDeletarUsuario() {
        long id = 1;

        String token = getToken();

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", id)
                .log().all()
                .when()
                .delete("/usuarios/{id}")
                .then()
                .log().all()
                .statusCode(204);
    }

}