package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Address;
import br.com.dotgo.dotgo.entities.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PublicServiceProviderDto {
    private Integer id;
    private String name;
    private String urlProfilePhoto;
    private String specialty;
    private Boolean verified;
    private Integer rating;
    private String phone;
    private String biography;

    List<Address> address = new ArrayList<>();

    public PublicServiceProviderDto(User user, String publicUrlPicture) {
        this.id = user.getId();
        this.name = user.getName();
        this.urlProfilePhoto = publicUrlPicture;
        this.specialty = user.getSpecialty();
        this.verified = user.getVerified();
        this.rating = 5;
        this.phone = user.getPhone();
        this.biography = user.getBiography();
        this.address = user.getAddresses();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrlProfilePhoto() {
        return urlProfilePhoto;
    }

    public void setUrlProfilePhoto(String urlProfilePhoto) {
        this.urlProfilePhoto = urlProfilePhoto;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    
    
}
