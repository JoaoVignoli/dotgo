package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.Feed;

public interface FeedRepository extends JpaRepository<Feed, Integer> {

}
