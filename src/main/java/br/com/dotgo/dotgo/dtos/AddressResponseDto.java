package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Address;
import br.com.dotgo.dotgo.entities.User;

public class AddressResponseDto {

    private String street;
    private String neighborhood;
    private String city;
    private String state;
    private Integer cep;
    private Integer address_number;
    private String complement;
    private User user;

    public AddressResponseDto(Address address) {
        this.street = address.getStreet();
        this.neighborhood = address.getNeighborhood();
        this.city = address.getCity();
        this.state = address.getState();
        this.cep = address.getCep();
        this.address_number = address.getAdress_number();
        this.complement = address.getComplement();
        this.user = address.getUser();
    }

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

    public User getUser() {
        return user;
    }
}
