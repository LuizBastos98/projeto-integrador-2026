package com.gustavo.barbearia.repository;

import com.gustavo.barbearia.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // 👇 É ESTA LINHA AQUI QUE O SPRING DATA JPA USA PARA FAZER A MÁGICA NO BANCO!
    List<Agendamento> findByClienteIdOrderByHoraInicialDesc(Long clienteId);

}