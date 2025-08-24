package br.com.dotgo.dotgo.dtos;

import java.util.Date;

import br.com.dotgo.dotgo.enums.UserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserPersonalDataRequestDto {

    private String name;
    @NotBlank(message = "O email não pode estar em branco.")
    @Email(message = "O formato do email é inválido.")
    private String email;
    @NotBlank(message = "O taxId (CPF/CNPJ) não pode estar em branco.")
    @Size(min = 11, max = 14, message = "O taxId deve ter entre 11 e 14 caracteres.")
    private String taxId;
    @NotBlank(message = "O telefone não pode estar em branco.")
    @Size(min = 11,max = 11, message = "O telefone deve ter no minimo/máximo 11 caracteres (apenas números).")
    private String phone;
    @NotBlank(message = "A senha não pode estar em branco.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
    private String password;
    @NotNull(message = "A data de aniversário não pode ser nula.")
    private Date birthday;
    @NotNull(message = "A role não pode ser nula.")
    @Enumerated(EnumType.STRING)
    private UserRole role;
    private String specialty;

    public UserRole getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getTaxId() {
        return taxId;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public Date getBirthday() {
        return birthday;
    }

    public String getSpecialty() {
        return specialty;
    }
}
