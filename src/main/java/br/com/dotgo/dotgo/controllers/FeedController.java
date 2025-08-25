package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dotgo.dotgo.dtos.FeedRequestDto;
import br.com.dotgo.dotgo.dtos.FeedResponseDto;
import br.com.dotgo.dotgo.entities.Feed;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.FeedRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/feeds")
public class FeedController {

    private final FeedRepository feedRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final static String FEED_PICTURES_FOLDER = "/pictures/users/";

    public FeedController(FeedRepository feedRepository, FileStorageService fileStorageService, UserRepository userRepository) {
        this.feedRepository = feedRepository;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> postMethodName(@ModelAttribute @Valid FeedRequestDto request) {

        Optional<User> user = this.userRepository.findById(request.getUserId());

        if (user.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        String picturesPath = FEED_PICTURES_FOLDER + user.get().getId() + "/feed";

        Feed newFeed = new Feed();
        newFeed.setPictureUrl(this.fileStorageService.uploadFile(request.getPicture(), picturesPath));
        newFeed.setUser(user.get());

        var feedSaved = this.feedRepository.save(newFeed);

        return ResponseEntity.status(HttpStatus.OK).body(new FeedResponseDto(feedSaved, this.fileStorageService.getPublicFileUrl(newFeed.getPictureUrl())));
    }
    

}
