package com.gustavo.barbearia.dtos;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRequestDTO(

        @NotNull(message = "Cliente é um capo obrigatório.")
        Long clienteId,

        @NotNull(message = "Barbeiro é um capo obrigatório.")
        Long barbeiroId,

        @NotNull(message = "Serviço é um capo obrigatório.")
        Long servicoId,

        @NotNull(message = "Hora inicial é um capo obrigatório.")
        LocalDateTime horaInicial
) {}