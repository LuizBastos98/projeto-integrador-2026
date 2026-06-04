package com.gustavo.barbearia.authcontroller;

import com.gustavo.barbearia.enums.TipoUsuario;

public record LoginResponseDTO(
        String token,
        Long id,
        String nome,
        TipoUsuario tipoUsuario
) {}