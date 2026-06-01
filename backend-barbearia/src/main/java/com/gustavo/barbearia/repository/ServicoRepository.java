package com.gustavo.barbearia.repository;

import com.gustavo.barbearia.entity.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    // Utilizado para verificar se o nome do serviço já existe na base de dados
    Optional<Servico> findByNome(String nome);

    // Retorna somente serviços ativos
    List<Servico> findByAtivoTrue();
}