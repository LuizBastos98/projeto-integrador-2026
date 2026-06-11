package com.gustavo.barbearia.controller;

import com.gustavo.barbearia.dtos.AgendamentoRequestDTO;
import com.gustavo.barbearia.dtos.AgendamentoResponseDTO;
import com.gustavo.barbearia.enums.StatusServico;
import com.gustavo.barbearia.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listar() {
        return ResponseEntity.ok(agendamentoService.listarTodos());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarMeusAgendamentos(@PathVariable("clienteId") Long clienteId) {
        return ResponseEntity.ok(agendamentoService.listarMeusAgendamentos(clienteId));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@RequestBody @Valid AgendamentoRequestDTO dto) {
        return ResponseEntity.ok(agendamentoService.salvar(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") StatusServico status) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(id, status));
    }
}