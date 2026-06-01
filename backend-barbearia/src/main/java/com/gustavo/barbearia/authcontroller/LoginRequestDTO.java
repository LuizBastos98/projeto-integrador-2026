package com.gustavo.barbearia.authcontroller;

public record LoginRequestDTO(
        String email,
        String senha
) {}