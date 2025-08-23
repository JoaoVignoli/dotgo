package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.ServiceHoldersResponseDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataResponseDto;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private static final String USERS_PICTURES_FOLDER = "pictures/users";

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserPersonalDataRequestDto request) {

        Optional<User> existingUser = this.userRepository.findByEmail(request.getEmail());
        
        if (existingUser.isPresent()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário já cadastrado.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        User newUser = new User();

        newUser.setRole(request.getRole());
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setTaxId(request.getTaxId());
        newUser.setPhone(request.getPhone());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setBirthday(request.getBirthday());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setVerified(false);

        var userSaved = this.userRepository.save(newUser);
        
        // Ajustar retorno para que retorne um DTO
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserPersonalDataResponseDto(userSaved));
    }

    @GetMapping
    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    @GetMapping("/serviceHolders")
    public ResponseEntity<List<ServiceHoldersResponseDto>> getServiceHolders() {

        List<User> serviceHolders = this.userRepository.findByRole(UserRole.SERVICE_HOLDER);
        ArrayList<ServiceHoldersResponseDto> responseList = new ArrayList<>();

        for (User serviceHolder : serviceHolders) {
            responseList.add(new ServiceHoldersResponseDto(
                serviceHolder.getId(), serviceHolder.getName(), serviceHolder.getSpecialty(), serviceHolder.getVerified(), 
                this.fileStorageService.getPublicFileUrl(serviceHolder.getPicture()), 5));
        }

        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> saveProfilePicture (@RequestParam MultipartFile picture, @RequestParam Integer userId) {

        Optional<User> user = this.userRepository.findById(userId);

        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        String folderPathWithId = USERS_PICTURES_FOLDER + "/" + userId;

        String status = fileStorageService.uploadFile(picture, USERS_PICTURES_FOLDER);

        user.get().setPicture(status);

        this.userRepository.save(user.get());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
