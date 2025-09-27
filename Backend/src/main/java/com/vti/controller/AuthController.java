package com.vti.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.dto.LoginInfoDto;
import com.vti.form.Authen.RegisterForm;
import com.vti.form.Authen.ForgetPasswordForm;
import com.vti.form.Authen.LoginForm;
import com.vti.service.Auth.IAuthService;

@RestController
@RequestMapping(value = "api/v1/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginForm form,
                                   HttpServletResponse response,
                                   @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<LoginInfoDto> loginResponse = authService.verify(form, response);
        return loginResponse;
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request,
                                         HttpServletResponse response,
                                         @RequestParam(name = "lang", required = false) String lang) {
        return authService.logout(request, response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> createAccountAsEmployee(@RequestBody @Valid RegisterForm createForm,
                                                          @RequestParam(name = "lang", required = false) String lang) {
        try {
            authService.createAccountAsNewUser(createForm);
            return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    
    @PostMapping("/forgot-password/{email}")
    public ResponseEntity<String> forgotPassword(@PathVariable String email,
                                                 @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<String> forgotPasswordResponse = authService.processForgotPassword(email);
        return forgotPasswordResponse;
    }
    
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<String> resetPassword(@PathVariable String token,
                                                @RequestBody @Valid ForgetPasswordForm form,
                                                @RequestParam(name = "lang", required = false) String lang) {
        if (!form.getNewPassword().equals(form.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
        }

        if (authService.isValidResetToken(token).getBody()) {
            authService.updatePassword(token, form.getNewPassword());
            return ResponseEntity.ok("Password reset successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }
}
