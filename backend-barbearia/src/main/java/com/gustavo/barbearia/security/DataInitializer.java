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

    @Override
    public void run(String... args) {

        boolean existeAdmin = usuarioRepository
                .findByEmail("administrador@barbearia.com")
                .isPresent();

        if (!existeAdmin) {
            try {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail("administrador@barbearia.com");
                admin.setSenha(passwordEncoder.encode("administrador"));
                admin.setTelefone("62994128475");
                admin.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
                admin.setAtivo(true);

                usuarioRepository.save(admin);
                System.out.println("Usuário do tipo ->Administrador<- criado com sucesso!");

            } catch (Exception e) {

                System.out.println("Aviso: Admin padrão não recriado. O telefone ou e-mail já está sendo usado por outro cadastro.");
            }
        }
    }
}