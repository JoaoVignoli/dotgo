package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;

public class AddressRequestDto {

    private String street;
    private String neighborhood;
    private String city;
    private String state;
    private Integer cep;
    private Integer address_number;
    private String complement;
    private Integer idUsuario;

    public String getStreet() {
        return street;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public Integer getCep() {
        return cep;
    }

    public Integer getAddress_number() {
        return address_number;
    }

    public String getComplement() {
        return complement;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }
}
