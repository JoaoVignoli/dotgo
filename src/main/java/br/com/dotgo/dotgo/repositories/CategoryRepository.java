package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
