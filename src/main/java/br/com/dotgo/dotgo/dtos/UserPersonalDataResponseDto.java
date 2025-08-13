package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;

import java.util.Date;

public class UserPersonalDataResponseDto {

    private String name;
    private String email;
    private String tax_id;
    private String phone;
    private String password;
    private Date birthday;

    public UserPersonalDataResponseDto(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.tax_id = user.getTax_id();
        this.phone = user.getPhone();
        this.password = user.getPassword();
        this.birthday = user.getBirthday();
    }

    public String getName() {
        return name;
    }

    public Date getBirthday() {
        return birthday;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getTax_id() {
        return tax_id;
    }

    public String getEmail() {
        return email;
    }
}
