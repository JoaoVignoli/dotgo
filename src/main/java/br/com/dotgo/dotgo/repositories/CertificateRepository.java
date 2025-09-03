package br.com.dotgo.dotgo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dotgo.dotgo.entities.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Integer>{

}
