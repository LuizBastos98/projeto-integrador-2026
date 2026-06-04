package com.gustavo.barbearia.entity;

import com.gustavo.barbearia.enums.StatusServico;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime horaInicial;

    @Column(nullable = false)
    private LocalDateTime horaFinal;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id", nullable = false)
    private Usuario barbeiro;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_servico", nullable = false)
    private StatusServico statusServico = StatusServico.PENDENTE;

    // Getters e Setters com a nomenclatura exata exigida pelo seu Service
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getHoraInicial() { return horaInicial; }
    public void setHoraInicial(LocalDateTime horaInicial) { this.horaInicial = horaInicial; }

    public LocalDateTime getHoraFinal() { return horaFinal; }
    public void setHoraFinal(LocalDateTime horaFinal) { this.horaFinal = horaFinal; }

    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }

    public Usuario getBarbeiro() { return barbeiro; }
    public void setBarbeiro(Usuario barbeiro) { this.barbeiro = barbeiro; }

    public Servico getServico() { return servico; }
    public void setServico(Servico servico) { this.servico = servico; }

    public StatusServico getStatusServico() { return statusServico; }
    public void setStatusServico(StatusServico statusServico) { this.statusServico = statusServico; }
}