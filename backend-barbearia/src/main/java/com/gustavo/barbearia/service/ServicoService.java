package com.gustavo.barbearia.service;

import com.gustavo.barbearia.dtos.ServicoRequestDTO;
import com.gustavo.barbearia.dtos.ServicoResponseDTO;
import com.gustavo.barbearia.entity.Servico;
import com.gustavo.barbearia.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public ServicoResponseDTO criar(ServicoRequestDTO dto) {
        if (servicoRepository.findByNome(dto.nome()).isPresent()) {
            throw new RuntimeException("Serviço já cadastrado.");
        }
        Servico servico = new Servico();
        dtoParaEntity(dto, servico);
        servico.setAtivo(true);
        return entityParaDto(servicoRepository.save(servico));
    }

    public List<ServicoResponseDTO> listar() {
        return servicoRepository.findAll().stream()
                .map(this::entityParaDto)
                .toList();
    }

    public ServicoResponseDTO atualizar(Long id, ServicoRequestDTO dto) {
        Servico servico = servicoRepository.findById(id).orElseThrow(() -> new RuntimeException("Serviço não encontrado."));
        dtoParaEntity(dto, servico);
        return entityParaDto(servicoRepository.save(servico));
    }

    public void desativar(Long id) {
        Servico servico = servicoRepository.findById(id).orElseThrow(() -> new RuntimeException("Serviço não encontrado."));
        servico.setAtivo(false);
        servicoRepository.save(servico);
    }

    public ServicoResponseDTO buscarPorId(Long id) {
        return servicoRepository.findById(id)
                .map(this::entityParaDto)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));
    }

    // Serve para ativar um serviço que foi desativado
    public void ativar(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));
        servico.setAtivo(true);
        servicoRepository.save(servico);
    }

    private void dtoParaEntity(ServicoRequestDTO dto, Servico servico) {
        servico.setNome(dto.nome());
        servico.setDescricao(dto.descricao());
        servico.setPreco(dto.preco());
        servico.setTempoDuracao(dto.tempoDuracao());
    }

    private ServicoResponseDTO entityParaDto(Servico servico) {
        return new ServicoResponseDTO(
                servico.getId(),
                servico.getNome(),
                servico.getDescricao(),
                servico.getPreco(),
                servico.getTempoDuracao(),
                servico.isAtivo());
    }
}