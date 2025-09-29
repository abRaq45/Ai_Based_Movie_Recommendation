package com.example.movieapi.Controller;

import com.example.movieapi.Entity.User;
import com.example.movieapi.Service.UserService;
import com.example.movieapi.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // -------------------- Register --------------------
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        userService.signUp(user);
        return "User registered successfully!";
    }

    // -------------------- Login -----------------------
    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {
        Optional<User> loggedInUser = userService.login(user.getUsername(), user.getPassword());
        if (loggedInUser.isPresent()) {
            return jwtUtil.generateToken(user.getUsername());
        } else {
            return "Invalid username or password";
        }
    }
}
