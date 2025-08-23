package br.com.dotgo.dotgo.dtos;

public class AddressRequestDto {

    private String street;
    private String neighborhood;
    private String city;
    private String state;
    private Integer cep;
    private Integer addressNumber;
    private String complement;
    private Integer userId;

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

    public Integer getaddressNumber() {
        return addressNumber;
    }

    public String getComplement() {
        return complement;
    }

    public Integer getUserId() {
        return userId;
    }
}
