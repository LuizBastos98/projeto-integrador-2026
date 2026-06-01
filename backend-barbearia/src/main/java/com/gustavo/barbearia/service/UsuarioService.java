package com.gustavo.barbearia.service;

import com.gustavo.barbearia.dtos.UsuarioRequestDTO;
import com.gustavo.barbearia.dtos.UsuarioResponseDTO;
import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Utilizado para JWT para criptografia da senha
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }
        if (usuarioRepository.findByTelefone(dto.telefone()).isPresent()) {
            throw new RuntimeException("Telefone já cadastrado.");
        }
        Usuario usuario = new Usuario();
        dtoParaEntity(dto, usuario);
        usuario.setAtivo(true);
        return entityParaDto(usuarioRepository.save(usuario));
    }

    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll().stream()
                .map(this::entityParaDto)
                .toList();
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        dtoParaEntity(dto, usuario);
        return entityParaDto(usuarioRepository.save(usuario));
    }

    public void desativar(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::entityParaDto)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    // Serve para Reativar um Usuário que foi Desativado
    public void ativar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }

    private void dtoParaEntity(UsuarioRequestDTO dto, Usuario entity) {
        entity.setNome(dto.nome());
        entity.setEmail(dto.email());
        entity.setTelefone(dto.telefone());
        entity.setTipoUsuario(dto.tipoUsuario());

        // Só faz a atualização da senha e criptografa se ela foi preenchida e for diferente da atual
        // Se não vai criar Hash de Hash e vai tornar a senha inutilizável
        if (dto.senha() != null && !dto.senha().isBlank()) {
            // Se a senha enviada não for idêntica ao hash já existente, criptografa a nova
            if (!dto.senha().equals(entity.getSenha())) {
                entity.setSenha(passwordEncoder.encode(dto.senha()));
            }
        }
    }

    private UsuarioResponseDTO entityParaDto(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.isAtivo(),
                usuario.getTipoUsuario()
        );
    }
}