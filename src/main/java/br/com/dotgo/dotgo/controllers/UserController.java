package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.UserSummaryResponseDto;
import br.com.dotgo.dotgo.dtos.FavoritesResponseDto;
import br.com.dotgo.dotgo.dtos.FeedResponseDto;
import br.com.dotgo.dotgo.dtos.ProductResponseDto;
import br.com.dotgo.dotgo.dtos.PublicServiceProviderDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataResponseDto;
import br.com.dotgo.dotgo.entities.Favorites;
import br.com.dotgo.dotgo.entities.Feed;
import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;
import br.com.dotgo.dotgo.repositories.FeedRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.AuthService;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final AuthService authService;
    private static final String USERS_PICTURES_FOLDER = "pictures/users";

    public UserController(
        UserRepository userRepository, PasswordEncoder passwordEncoder,
        FileStorageService fileStorageService, AuthService authService, FeedRepository feedRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.authService = authService;
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
        newUser.setSpecialty(request.getSpecialty());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setVerified(false);

        var userSaved = this.userRepository.save(newUser);
        
        // Ajustar retorno para que retorne um DTO
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserPersonalDataResponseDto(userSaved));
    }

     @GetMapping("/summary")
    public ResponseEntity<?> getUsersSummary(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) UserRole role) {
        
        try {
            // Verificar permissões
            List<UserRole> accessibleRoles = authService.getAccessibleRoles();
            
            if (role != null && !accessibleRoles.contains(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acesso negado para esta role"));
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users;
            
            if (role != null) {
                // Filtrar pela role específica (sem verificar verified)
                users = userRepository.findByRole(role, pageable);
            } else {
                // Filtrar pelas roles acessíveis (sem verificar verified)
                if (accessibleRoles.isEmpty()) {
                    return ResponseEntity.ok(Page.empty());
                }
                
                users = userRepository.findByRoleIn(accessibleRoles, pageable);
            }
            
            // Converter para DTO
            Page<UserSummaryResponseDto> summaryPage = users.map(user -> {
                String publicUrl = fileStorageService.getPublicFileUrl(user.getPicture());
                return new UserSummaryResponseDto(user, publicUrl);
            });
            
            return ResponseEntity.ok(summaryPage);
            
        } catch (Exception e) {
            // Log do erro
            System.err.println("Erro ao buscar usuários: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno do servidor"));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            User user = userOpt.get();

            // Se é prestador, dados públicos
            if (user.getRole() == UserRole.SERVICE_HOLDER) {
                // Prestadores de serviço têm dados públicos - qualquer um pode acessar
                return ResponseEntity.status(HttpStatus.OK).body(new PublicServiceProviderDto(user, this.fileStorageService.getPublicFileUrl(user.getPicture())));
            }
            
            // Verificar se pode acessar esta role
            if (!authService.canAccessRole(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acesso negado para este tipo de usuário"));
            }
            
            // Para outros tipos, verificar acesso específico
            if (!authService.canAccessSpecificUser(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acesso negado aos dados deste usuário"));
            }
            
            // return ResponseEntity.status(HttpStatus.OK).body(new PrivateUserDto(user));
            
            return ResponseEntity.status(HttpStatus.OK).body(new PublicServiceProviderDto(user, this.fileStorageService.getPublicFileUrl(user.getPicture())));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) 
                .body(Map.of("error", "Erro interno"));
        }
    }
    
    // Talvez lterar para "/{}/picture/upload" fique mais semântico
    @PostMapping("/upload")
    public ResponseEntity<?> saveProfilePicture (@RequestParam("picture") MultipartFile picture, @RequestParam("userId") Integer userId) {

        Optional<User> user = this.userRepository.findById(userId);

        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        String folderPathWithId = USERS_PICTURES_FOLDER + "/" + userId;

        String status = fileStorageService.uploadFile(picture, folderPathWithId);

        user.get().setPicture(status);

        this.userRepository.save(user.get());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<?> getFavorites(@PathVariable Integer userId) {
        
        Optional<User> user = this.userRepository.findById(userId);

        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        List<Favorites> userFavorites = user.get().getServiceProvidersLikeds();
        ArrayList<FavoritesResponseDto> responseList = new ArrayList<>();

        for (Favorites favorites : userFavorites) {
            responseList.add(new FavoritesResponseDto(favorites));
        }

        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }
    
    @GetMapping("/{userId}/products")
    public ResponseEntity<?> getProducts(@PathVariable Integer userId) {

        Optional<User> optionalUser = this.userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = optionalUser.get();

        List<Product> products = user.getProducts();

        ArrayList<ProductResponseDto> responseList = new ArrayList<>();

        for (Product product : products) {
            String url = this.fileStorageService.getPublicFileUrl(product.getPicture());

            ProductResponseDto productResponseDto = new ProductResponseDto(product, url);

            responseList.add(productResponseDto);
        }


        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }

    @GetMapping("/{userId}/feed")
    public ResponseEntity<?> getFeed(@PathVariable Integer userId) {

        Optional<User> optionalUser = this.userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = optionalUser.get();

        List<Feed> feedPictures = user.getFeed();

        List<FeedResponseDto> responseList = new ArrayList<>();

        for (Feed feedPicture : feedPictures) {
            
            responseList.add(new FeedResponseDto(feedPicture, this.fileStorageService.getPublicFileUrl(feedPicture.getPictureUrl())));

        }

        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }
}
