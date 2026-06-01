package com.gustavo.barbearia.repository;

import com.gustavo.barbearia.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // Faz uma verificação para saber se o Barbeiro tem disponibilidade naquele dia/horário
    // E se for cancelado, disponibiliza novamente o horário para um novo agendamento
    @Query("""
        SELECT COUNT(a) > 0 
        FROM Agendamento a
        WHERE a.barbeiro.id = :barbeiroId
        AND a.statusServico <> com.gustavo.barbearia.enums.StatusServico.CANCELADO
        AND a.horaInicial < :horaFinal
        AND a.horaFinal > :horaInicial
    """)
    boolean existsConflitoHorario(
            @Param("barbeiroId") Long barbeiroId,
            @Param("horaInicial") LocalDateTime horaInicial,
            @Param("horaFinal") LocalDateTime horaFinal
    );

    List<Agendamento> findByClienteId(Long clienteId);
    List<Agendamento> findByBarbeiroId(Long barbeiroId);
}