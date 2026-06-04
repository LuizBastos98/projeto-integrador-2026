package com.gustavo.barbearia.dtos;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AgendamentoRequestDTO(
        @JsonProperty("horaInicial")
        @NotNull(message = "A hora inicial é obrigatória.")
        LocalDateTime horaInicial,

        @JsonProperty("clienteId")
        @NotNull(message = "Cliente é obrigatório.")
        Long clienteId,

        @JsonProperty("barbeiroId")
        @NotNull(message = "Barbeiro é obrigatório.")
        Long barbeiroId,

        @JsonProperty("servicoId")
        @NotNull(message = "Serviço é obrigatório.")
        Long servicoId
) {}