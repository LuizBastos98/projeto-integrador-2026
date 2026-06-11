package com.gustavo.barbearia.repository;

import com.gustavo.barbearia.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByClienteIdOrderByHoraInicialDesc(Long clienteId);

    // 👇 NOVA REGRA: Retorna TRUE se a agenda do barbeiro já estiver ocupada neste intervalo
    @Query("SELECT COUNT(a) > 0 FROM Agendamento a " +
            "WHERE a.barbeiro.id = :barbeiroId " +
            "AND a.statusServico != 'CANCELADO' " +
            "AND (a.horaInicial < :novoFim AND a.horaFinal > :novoInicio)")
    boolean existeConflitoDeHorario(
            @Param("barbeiroId") Long barbeiroId,
            @Param("novoInicio") LocalDateTime novoInicio,
            @Param("novoFim") LocalDateTime novoFim
    );
}