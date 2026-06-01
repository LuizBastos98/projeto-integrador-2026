package com.gustavo.barbearia.dtos;

import com.gustavo.barbearia.enums.TipoUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        boolean ativo,
        TipoUsuario tipoUsuario
) {}