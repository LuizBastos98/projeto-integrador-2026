package com.gustavo.barbearia.repository;

import com.gustavo.barbearia.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Utilizado para verificar se o e-mail ou telefone já existe na base de dados
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByTelefone(String telefone);

    // Retorna somente os usuários ativos
    List<Usuario> findByAtivoTrue();

}