package com.gustavo.barbearia.dtos;

import com.gustavo.barbearia.enums.StatusServico;

import java.time.LocalDateTime;

public record AgendamentoResponseDTO(
        Long id,
        String nomeCliente,
        String nomeBarbeiro,
        String nomeServico,
        LocalDateTime horaInicial,
        LocalDateTime horaFinal,
        StatusServico status
) {}