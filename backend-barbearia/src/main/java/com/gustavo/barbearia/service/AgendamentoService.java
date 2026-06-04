package com.gustavo.barbearia.service;

import com.gustavo.barbearia.dtos.AgendamentoRequestDTO;
import com.gustavo.barbearia.dtos.AgendamentoResponseDTO;
import com.gustavo.barbearia.entity.Agendamento;
import com.gustavo.barbearia.entity.Servico;
import com.gustavo.barbearia.enums.StatusServico;
import com.gustavo.barbearia.repository.AgendamentoRepository;
import com.gustavo.barbearia.repository.ServicoRepository;
import com.gustavo.barbearia.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicoRepository servicoRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                              UsuarioRepository usuarioRepository,
                              ServicoRepository servicoRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicoRepository = servicoRepository;
    }

    public List<AgendamentoResponseDTO> listarTodos() {
        return agendamentoRepository.findAll().stream()
                .map(AgendamentoResponseDTO::new)
                .toList();
    }

    public AgendamentoResponseDTO salvar(AgendamentoRequestDTO dto) {
        Agendamento agendamento = new Agendamento();

        // 1. Define a hora de início que veio do Front-End
        agendamento.setHoraInicial(dto.horaInicial());

        // 2. Busca o Serviço no banco para saber quanto tempo ele demora
        Servico servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        // 3. MÁGICA: O Java calcula a hora final sozinho somando os minutos!
        agendamento.setHoraFinal(dto.horaInicial().plusMinutes(servico.getTempoDuracao()));

        // 4. Conecta as outras Entidades
        agendamento.setCliente(usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado.")));

        agendamento.setBarbeiro(usuarioRepository.findById(dto.barbeiroId())
                .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado.")));

        agendamento.setServico(servico);
        agendamento.setStatusServico(StatusServico.PENDENTE);

        // 5. Salva no banco e devolve o DTO bonitinho
        agendamento = agendamentoRepository.save(agendamento);
        return new AgendamentoResponseDTO(agendamento);
    }

    public AgendamentoResponseDTO atualizarStatus(Long id, StatusServico status) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        agendamento.setStatusServico(status);
        agendamento = agendamentoRepository.save(agendamento);

        return new AgendamentoResponseDTO(agendamento);
    }
}