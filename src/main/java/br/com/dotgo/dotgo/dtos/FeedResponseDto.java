package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Feed;

public class FeedResponseDto {

    private Integer id;
    private String picture_url;

    public FeedResponseDto() {
    }

    public FeedResponseDto(Feed feed, String picture_url) {
        this.id = feed.getId();
        this.picture_url = picture_url;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer userId) {
        this.id = userId;
    }

    public String getPicture_url() {
        return picture_url;
    }

    public void setPicture_url(String picture_url) {
        this.picture_url = picture_url;
    }

}
