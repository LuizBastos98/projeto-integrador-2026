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

import java.time.LocalDateTime;
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

    public List<AgendamentoResponseDTO> listarMeusAgendamentos(Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByHoraInicialDesc(clienteId)
                .stream()
                .map(AgendamentoResponseDTO::new)
                .toList();
    }

    public AgendamentoResponseDTO salvar(AgendamentoRequestDTO dto) {
        Agendamento agendamento = new Agendamento();
        agendamento.setHoraInicial(dto.horaInicial());

        // 1. Puxa o serviço primeiro para saber quanto tempo o corte demora
        Servico servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        // 2. Calcula exatamente que horas o corte termina
        LocalDateTime horaFim = dto.horaInicial().plusMinutes(servico.getTempoDuracao());
        agendamento.setHoraFinal(horaFim);

        // 3. Validação de Conflito: Bate no banco para checar a disponibilidade do Barbeiro
        boolean agendaOcupada = agendamentoRepository.existeConflitoDeHorario(
                dto.barbeiroId(),
                dto.horaInicial(),
                horaFim
        );

        // 4. Se estiver ocupado, bloqueia a operação e avisa o Front-End
        if (agendaOcupada) {
            throw new RuntimeException("Este profissional já possui um agendamento nesse horário. Por favor, escolha outra hora.");
        }

        // 5. Se estiver livre, segue com o agendamento normal
        agendamento.setCliente(usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado.")));

        agendamento.setBarbeiro(usuarioRepository.findById(dto.barbeiroId())
                .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado.")));

        agendamento.setServico(servico);
        agendamento.setStatusServico(StatusServico.PENDENTE);

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