package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dotgo.dotgo.dtos.FavoritesRequestDto;
import br.com.dotgo.dotgo.dtos.FavoritesResponseDto;
import br.com.dotgo.dotgo.entities.Favorites;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.FavoritesRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/favorites")
public class FavoritesController {

    private FavoritesRepository favoritesRepository;
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> postMethodName(@RequestBody @Valid FavoritesRequestDto requestDto) {
        
        Optional<User> serviceProvider = this.userRepository.findById(requestDto.getServiceProviderId());
        Optional<User> user = this.userRepository.findById(requestDto.getUserId());

        if (serviceProvider.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Prestador de Serviços não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        Favorites newFavorites = new Favorites();
        newFavorites.setServiceProvider(serviceProvider.get());
        newFavorites.setUser(user.get());

        var favoritesSaved = this.favoritesRepository.save(newFavorites);

        return ResponseEntity.status(HttpStatus.CREATED).body(new FavoritesResponseDto(favoritesSaved));
    }
    
}
