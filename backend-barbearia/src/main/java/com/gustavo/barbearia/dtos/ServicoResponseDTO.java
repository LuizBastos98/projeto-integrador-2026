package com.gustavo.barbearia.dtos;

import java.math.BigDecimal;

public record ServicoResponseDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        Integer tempoDuracao,
        boolean ativo
) {}