package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.Favorites;

public interface FavoritesRepository extends JpaRepository<Favorites, Integer>{
    
}
