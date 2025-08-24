package br.com.dotgo.dotgo.dtos;

public class ServiceHoldersResponseDto {
    Integer id;
    String name;
    String specialty;
    Boolean verified;
    String urlProfilePhoto;
    Integer rating;

    public ServiceHoldersResponseDto(Integer id, String name, String specialty, Boolean verified,
            String urlProfilePhoto, Integer rating) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.verified = verified;
        this.urlProfilePhoto = urlProfilePhoto;
        this.rating = rating;
    }

    public ServiceHoldersResponseDto() {
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

    public String getUrlProfilePhoto() {
        return urlProfilePhoto;
    }

    public void setUrlProfilePhoto(String urlProfilePhoto) {
        this.urlProfilePhoto = urlProfilePhoto;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

}
