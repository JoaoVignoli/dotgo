package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.Date;

public class UserPersonalDataResponseDto {

    private String name;
    private String email;
    private String taxId;
    private String phone;
    private String password;
    private Date birthday;
    @Enumerated(EnumType.STRING)
    private UserRole role;

    public UserPersonalDataResponseDto(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.taxId = user.getTaxId();
        this.phone = user.getPhone();
        this.password = user.getPassword();
        this.birthday = user.getBirthday();
        this.role = user.getRole();
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

    public String getTaxId() {
        return taxId;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() { return role; }
}
