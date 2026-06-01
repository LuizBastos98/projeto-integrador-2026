package com.gustavo.barbearia.service;

import com.gustavo.barbearia.dtos.AgendamentoRequestDTO;
import com.gustavo.barbearia.dtos.AgendamentoResponseDTO;
import com.gustavo.barbearia.entity.Agendamento;
import com.gustavo.barbearia.entity.Servico;
import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.enums.StatusServico;
import com.gustavo.barbearia.repository.AgendamentoRepository;
import com.gustavo.barbearia.repository.ServicoRepository;
import com.gustavo.barbearia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Usuario cliente = usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Usuario barbeiro = usuarioRepository.findById(dto.barbeiroId())
                .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado."));
        Servico servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        LocalDateTime horaInicial = dto.horaInicial();
        LocalDateTime horaFinal = horaInicial.plusMinutes(servico.getTempoDuracao());

        boolean existeConflito = agendamentoRepository.existsConflitoHorario(
                dto.barbeiroId(),
                horaInicial,
                horaFinal
        );

        if (existeConflito) {
            throw new RuntimeException("O barbeiro já possui agendamento nessa data/horário.");
        }

        Agendamento agendamento = new Agendamento();
        dtoParaEntity(agendamento, cliente, barbeiro, servico, horaInicial, horaFinal);
        agendamento.setStatusServico(StatusServico.PENDENTE);
        return entityParaDto(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponseDTO> listar() {
        return agendamentoRepository.findAll()
                .stream()
                .map(this::entityParaDto)
                .toList();
    }

    // Na nossa lógica não faz tanto sentido um agendamento ser alterado, é melhor cancelar e criar um novo
    // Esse metodo só tem a função de alterar o Status do Agendamento
    // Ou seja, ele só vai alterar o Enum de Status do Agendamento
    // Para que o Barbeiro possa cancelar um Agendamento que não seja possível executar
    // Ou até mesmo marcar como finalizado um agendamento no sistema
    public AgendamentoResponseDTO atualizarStatus(Long id, StatusServico novoStatus) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));
        agendamento.setStatusServico(novoStatus);
        return entityParaDto(agendamentoRepository.save(agendamento));
    }

    public AgendamentoResponseDTO buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));
        return entityParaDto(agendamento);
    }

    public void cancelar(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        agendamento.setStatusServico(StatusServico.CANCELADO);
        agendamentoRepository.save(agendamento);
    }

    private void dtoParaEntity(Agendamento agendamento, Usuario cliente, Usuario barbeiro, Servico servico, LocalDateTime horaInicial, LocalDateTime horaFinal) {
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);
        agendamento.setHoraInicial(horaInicial);
        agendamento.setHoraFinal(horaFinal);
    }

    private AgendamentoResponseDTO entityParaDto(Agendamento agendamento) {
        return new AgendamentoResponseDTO(
                agendamento.getId(),
                agendamento.getCliente().getNome(),
                agendamento.getBarbeiro().getNome(),
                agendamento.getServico().getNome(),
                agendamento.getHoraInicial(),
                agendamento.getHoraFinal(),
                agendamento.getStatusServico()
        );
    }
}