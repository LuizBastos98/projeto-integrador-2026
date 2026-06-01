package com.gustavo.barbearia.security;

import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.enums.TipoUsuario;
import com.gustavo.barbearia.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
    O sistema cria automáticamente um usuário padrão de nível administrador
    Essa prática no mercado se chama Seeding / Bootstrap de Dados Iniciais
    É necessário para que o usuário consiga logar pela primeira vez e gerenciar o sistema
    */

    @Override
    public void run(String... args) {

        boolean existeAdmin = usuarioRepository
                .findByEmail("administrador@barbearia.com")
                .isPresent();

        if (!existeAdmin) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("administrador@barbearia.com");
            admin.setSenha(passwordEncoder.encode("administrador"));
            admin.setTelefone("62994128475");
            admin.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
            admin.setAtivo(true);

            usuarioRepository.save(admin);

            System.out.println("Usuário do tipo ->Administrador<- criado com sucesso!");
        }
    }
}