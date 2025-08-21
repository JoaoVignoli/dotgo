package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}
