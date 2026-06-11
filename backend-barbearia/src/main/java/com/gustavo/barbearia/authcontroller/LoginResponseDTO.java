package com.gustavo.barbearia.authcontroller;

public record LoginResponseDTO(
        String token,
        Long id,
        String nome,
        String tipoUsuario
) {}