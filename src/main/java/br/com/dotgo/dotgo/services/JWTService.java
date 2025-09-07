package br.com.dotgo.dotgo.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.function.Function;

@Component
public class JWTService {
    private static final long EXPIRATION_MINUTES = 60;
    private final String SECRET = "5v9gBzX97KfLp3n8Rm1sEtWqYaVx0ZdCJhULuOFiPkGTvNMR";

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now(); // Momento atual, sempre em UTC.
        Instant expirationTime = now.plus(EXPIRATION_MINUTES, ChronoUnit.MINUTES); // Adiciona 60 minutos

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(now)) // Converte o Instant para o legado Date
                .setExpiration(Date.from(expirationTime)) // Converte o Instant para o legado Date
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }


    /**
     * Extrai o username (subject) de um token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Valida se o token pertence ao usuário e não está expirado.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

        /**
     * Extrai o token JWT do cookie da requisição.
     */
    public String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("authToken".equals(cookie.getName())) { 
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    /**
     * Valida se o token é válido (não expirado e bem formado).
     */
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verifica se o token está expirado.
     */
    private boolean isTokenExpired(String token) {
        Instant expiration = extractExpiration(token).toInstant();
        // Compara a expiração com o momento atual em UTC.
        return expiration.isBefore(Instant.now());
    }

    /**
     * Extrai a data de expiração de um token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Função genérica para extrair qualquer "claim" (informação) do corpo do token.
     * Evita a repetição de código de parsing.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Método central que faz o parse do token e extrai todas as informações.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
    }
}