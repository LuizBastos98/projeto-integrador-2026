package com.gustavo.barbearia.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ServicoRequestDTO(

        @NotBlank(message = "Nome é um campo obrigatório.")
        String nome,

        String descricao,

        @NotNull(message = "Preço é um campo obrigatório.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero.")
        BigDecimal preco,

        @NotNull(message = "Tempo de duração do serviço é um campo obrigatório.")
        @Min(value = 1, message = "Tempo de duração deve ser no mínimo 1 minuto.")
        Integer tempoDuracao
) {}