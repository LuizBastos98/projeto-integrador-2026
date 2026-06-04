package com.gustavo.barbearia.authcontroller;

import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.repository.UsuarioRepository;
import com.gustavo.barbearia.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {

        // 1. Busca o usuário no banco ANTES de testar a senha
        Usuario usuarioLogado = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos."));

        // 2. A NOSSA NOVA REGRA DE SEGURANÇA AQUI 👇
        // (Nota: se o Java não reconhecer 'isAtivo()', mude para 'getAtivo()')
        if (!usuarioLogado.isAtivo()) {
            throw new RuntimeException("Acesso Negado: Este usuário foi desativado pela administração.");
        }

        // 3. Confirma se a senha está correta
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        // 4. Gera o crachá (Token)
        String token = jwtService.gerarToken(dto.email());

        // 5. Devolve os dados para o Front-End
        return new LoginResponseDTO(token, usuarioLogado.getNome(), usuarioLogado.getTipoUsuario());
    }
}