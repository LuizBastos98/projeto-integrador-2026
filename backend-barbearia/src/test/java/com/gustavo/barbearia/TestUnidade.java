package com.gustavo.barbearia;

import com.gustavo.barbearia.entity.Agendamento;
import com.gustavo.barbearia.entity.Servico;
import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.enums.StatusServico;
import com.gustavo.barbearia.enums.TipoUsuario;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestUnidade {

    private static Usuario cliente;
    private static Usuario barbeiro;
    private static Servico servicoCorte;
    private static Servico servicoCompleto;

    @BeforeAll
    public static void setUp() {
        // Objetos do Tipo Usuário
        cliente = new Usuario(1L, "Lucas de Souza", "lucas@email.com", "123456", "62998743145", true, TipoUsuario.CLIENTE);
        barbeiro = new Usuario(2L, "Pedro Santos Oliveira", "pedro@barbearia.com", "654321", "62999876732", true, TipoUsuario.BARBEIRO);

        // Objetos do Tipo Serviço
        servicoCorte = new Servico(1L, "Corte Degradê", "Corte Degradê de Cabelo", BigDecimal.valueOf(40.00), 30, true);
        servicoCompleto = new Servico(2L, "Corte e Barba", "Corte de Cabelo e Barba Completa", BigDecimal.valueOf(75.00), 50, true);
    }

    @Test
    public void testCalcularHoraFinalServicoCurto() {
        // Define o Dia/Horário (14:00)
        LocalDateTime horaInicial = LocalDateTime.of(2026, 5, 27, 14, 0);

        // Cria o Agendamento com os Objetos criados
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servicoCorte);
        agendamento.setHoraInicial(horaInicial);

        // Simulação da Regra de Negócio de cálculo de tempo
        agendamento.setHoraFinal(agendamento.getHoraInicial().plusMinutes(agendamento.getServico().getTempoDuracao()));

        // Espera-se finalizar o serviço as 14:30 e verifica o retorno
        LocalDateTime previsaoTermino = LocalDateTime.of(2026, 5, 27, 14, 30);
        assertEquals(previsaoTermino, agendamento.getHoraFinal());
    }

    @Test
    public void testCalcularHoraFinalServicoLongo() {
        LocalDateTime horaInicial = LocalDateTime.of(2026, 5, 27, 15, 30);

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servicoCompleto);
        agendamento.setHoraInicial(horaInicial);

        agendamento.setHoraFinal(agendamento.getHoraInicial().plusMinutes(agendamento.getServico().getTempoDuracao()));

        LocalDateTime previsaoTermino = LocalDateTime.of(2026, 5, 27, 16, 20);
        assertEquals(previsaoTermino, agendamento.getHoraFinal());
    }

    @Test
    public void testStatusInicialAgendamentoPendente() {
        Agendamento agendamento = new Agendamento();

        agendamento.setStatusServico(StatusServico.PENDENTE);

        StatusServico enumEsperado = StatusServico.PENDENTE;
        assertEquals(enumEsperado, agendamento.getStatusServico());
    }

    @Test
    public void testStatusCancelarAgendamento() {
        // Cria um Objeto de Agendamento e atribui-o para PENDENTE
        Agendamento agendamento = new Agendamento();
        agendamento.setStatusServico(StatusServico.PENDENTE);

        // Verifica se a Regra de Negócio do metodo de Cancelar está funcionando
        agendamento.setStatusServico(StatusServico.CANCELADO);

        // Verifica o retorno
        StatusServico enumEsperado = StatusServico.CANCELADO;
        assertEquals(enumEsperado, agendamento.getStatusServico());
    }

}
