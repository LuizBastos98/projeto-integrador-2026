package com.gustavo.barbearia.controller;

import com.gustavo.barbearia.entity.Servico;
import com.gustavo.barbearia.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/servicos")
// @CrossOrigin(origins = "http://localhost:5173") // Descomente caso não tenha um WebMvcConfigurer global para o Vite
public class ServicoController {

    @Autowired
    private ServicoRepository repository;

    // 🟢 LISTAR: Retorna todos os serviços direto do banco (Sem filtro de inativos)
    @GetMapping
    public ResponseEntity<List<Servico>> listar() {
        List<Servico> servicos = repository.findAll();
        return ResponseEntity.ok(servicos);
    }

    // 🔵 CRIAR: Cadastra um novo serviço
    @PostMapping
    @Transactional
    public ResponseEntity<Servico> criar(@RequestBody Servico servico) {
        Servico servicoSalvo = repository.save(servico);
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoSalvo);
    }

    // 🟠 ATUALIZAR: Edita um serviço existente
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Servico> atualizar(@PathVariable Long id, @RequestBody Servico dadosAtualizados) {
        Optional<Servico> servicoOptional = repository.findById(id);

        if (servicoOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não achar
        }

        Servico servico = servicoOptional.get();

        // Atualiza apenas os dados permitidos
        servico.setNome(dadosAtualizados.getNome());
        servico.setDescricao(dadosAtualizados.getDescricao());
        servico.setTempoDuracao(dadosAtualizados.getTempoDuracao());
        servico.setPreco(dadosAtualizados.getPreco());

        // Retorna o objeto atualizado
        return ResponseEntity.ok(repository.save(servico));
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        // Verifica se o serviço existe antes de tentar deletar
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não achar
        }

        // Dispara o comando DELETE no banco de dados
        repository.deleteById(id);

        return ResponseEntity.noContent().build(); // Retorna 204 indicando sucesso sem corpo
    }
}