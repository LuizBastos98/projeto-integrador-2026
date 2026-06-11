package com.gustavo.barbearia.authcontroller;

import com.gustavo.barbearia.entity.Usuario;
import com.gustavo.barbearia.repository.UsuarioRepository;
import com.gustavo.barbearia.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
            );


            Usuario usuarioLogado = usuarioRepository.findByEmail(dto.email())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));


            if (!usuarioLogado.isAtivo()) {
                // Retorna erro 403 (Forbidden)
                return ResponseEntity.status(403).body("Acesso Negado: Este usuário foi desativado pela administração.");
            }

            String token = jwtService.gerarToken(dto.email());


            return ResponseEntity.ok(new LoginResponseDTO(
                    token,
                    usuarioLogado.getId(),
                    usuarioLogado.getNome(),
                    usuarioLogado.getTipoUsuario().name() // Garante que o Enum vira String
            ));

        } catch (Exception e) {
            // Se a senha estiver errada, cai aqui e devolve erro 401 (Unauthorized)
            return ResponseEntity.status(401).body("Email ou senha incorretos.");
        }
    }
}