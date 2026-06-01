package com.gustavo.barbearia.dtos;

import com.gustavo.barbearia.enums.TipoUsuario;
import jakarta.validation.constraints.*;

public record UsuarioRequestDTO(

        @NotBlank(message = "Nome é um campo  obrigatório.")
        String nome,

        @NotBlank(message = "Email é um campo obrigatório.")
        @Email(message = "Formato de E-mail inválido.")
        String email,

        @NotBlank(message = "Senha é um campo obrigatória.")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres.")
        String senha,

        @NotBlank(message = "Telefone é um campo obrigatório.")
        @Pattern(regexp = "\\d{11}", message = "Telefone deve conter 11 dígitos (DDD + número).")
        String telefone,

        @NotNull(message = "Tipo de usuário é um campo obrigatório.")
        TipoUsuario tipoUsuario
) {}