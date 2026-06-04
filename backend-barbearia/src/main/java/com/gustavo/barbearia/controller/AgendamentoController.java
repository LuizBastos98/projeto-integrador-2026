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

    // Nota: Certifique-se de que o seu Service possui esses métodos.
    // Caso tenham nomes diferentes, ajuste aqui no Controller.

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listar() {
        // Supondo que seu service tenha um método listarTodos()
        return ResponseEntity.ok(agendamentoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@RequestBody @Valid AgendamentoRequestDTO dto) {
        // Supondo que seu service tenha um método salvar(dto)
        return ResponseEntity.ok(agendamentoService.salvar(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(@PathVariable Long id, @RequestParam StatusServico status) {
        // Supondo que seu service tenha um método atualizarStatus(id, status)
        return ResponseEntity.ok(agendamentoService.atualizarStatus(id, status));
    }
}