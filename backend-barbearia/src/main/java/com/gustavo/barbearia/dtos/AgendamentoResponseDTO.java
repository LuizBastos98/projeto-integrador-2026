package com.gustavo.barbearia.dtos;

import com.gustavo.barbearia.enums.StatusServico;
import java.time.LocalDateTime;
import com.gustavo.barbearia.entity.Agendamento;

public record AgendamentoResponseDTO(
        Long id,
        LocalDateTime horaInicial,
        LocalDateTime horaFinal,
        String clienteNome,
        String barbeiroNome,
        String servicoNome,
        StatusServico statusServico
) {
    public AgendamentoResponseDTO(Agendamento agendamento) {
        this(
                agendamento.getId(),
                agendamento.getHoraInicial(),
                agendamento.getHoraFinal(),
                agendamento.getCliente().getNome(),
                agendamento.getBarbeiro().getNome(),
                agendamento.getServico().getNome(),
                agendamento.getStatusServico()
        );
    }
}