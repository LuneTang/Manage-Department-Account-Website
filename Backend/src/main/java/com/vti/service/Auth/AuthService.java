package com.vti.service.Auth;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.vti.dto.LoginInfoDto;
import com.vti.entity.Account;
import com.vti.entity.Department;
import com.vti.entity.PasswordResetToken;
import com.vti.entity.Account.Role;
import com.vti.form.Authen.RegisterForm;
import com.vti.form.Authen.LoginForm;
import com.vti.repository.IAccountRepository;
import com.vti.repository.IDepartmentRepository;
import com.vti.repository.IPasswordResetTokenRepository;

@Service
public class AuthService implements IAuthService{
    
    @Autowired
    private IAccountRepository accountRepository;
    
    @Autowired
    private IDepartmentRepository departmentRepository;
    
    @Autowired
    private IPasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private TokenBlacklistService tokenBlacklistService;
    
    @Autowired
    private JWTService jwtService;
    
    @Autowired
    JavaMailSender javaMailSender;

    @Override
    @Transactional
    public void createAccountAsNewUser(RegisterForm form) {
        
        Account account = modelMapper.map(form, Account.class);
        
        Department department = departmentRepository.findById(1).get();
        
        // Set default department as waiting
        account.setDepartment(department);
        
        // Set default role as employee
        account.setRole(Role.EMPLOYEE);
        
        // Set password encoded
        account.setPassword(passwordEncoder.encode(form.getPassword()));
        
        accountRepository.save(account);
        
        department.setTotalMember(department.getAccounts().size());
        
        departmentRepository.save(department);
        
    }
    
    @Override
    public ResponseEntity<LoginInfoDto> verify(LoginForm form, HttpServletResponse response) {
        try {
            // Try to authenticate with the provided username and password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(form.getUsername(), form.getPassword())
            );

            if (authentication.isAuthenticated()) {
                // Authentication successful, fetch user information
                LoginInfoDto dto = modelMapper.map(accountRepository.findByUsername(form.getUsername()), LoginInfoDto.class);
                String token = jwtService.generateToken(form.getUsername(), form.isRememberMe());

                // Set JWT token as a cookie if rememberMe is true
                if (form.isRememberMe()) {
                    Cookie cookie = new Cookie("jwtToken", token);
                    cookie.setMaxAge(2592000); // 30 days
                    cookie.setHttpOnly(true);
                    response.addCookie(cookie);
                }

                dto.setToken(token);
                return ResponseEntity.ok(dto);
            }
        } catch (AuthenticationException ex) {
            // If authentication fails, return an error notification
        	throw new RuntimeException("Invalid username or password");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Override
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);  // Extract the token from the "Bearer <token>" string
        }

        if (token != null) {
            tokenBlacklistService.addToBlacklist(token);  // Add the token to the blacklist
            
         // Clear the cookie 
            Cookie cookie = new Cookie("jwtToken", null); 
            cookie.setMaxAge(0); 
            response.addCookie(cookie);
            
            return ResponseEntity.ok("Successfully logged out !");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is missing");
        }
    }

    @Override
    public ResponseEntity<String> processForgotPassword(String email) {
        Account account = accountRepository.findByEmail(email);
        if (account != null) {
            // Generate a reset token
            String resetToken = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusDays(1);  // Token expires in 1 day
            
            // Save the reset token in the database
            System.out.println("Attempting to save reset token for email: " + email);
            saveResetToken(email, resetToken, Date.from(expiryDate.atZone(ZoneId.systemDefault()).toInstant()));

            // Send reset link via email
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("cengying521@gmail.com");  
            msg.setTo(email);
            msg.setSubject("Password Reset Request");
            msg.setText("Hello, \n\nWe received a request to reset your password for your account. "
            			+ "Please click on the link below to proceed with resetting your password. This link will expire in 24 hours. \n\n" 
                        + "http://localhost:1001/pages/reset-password.html?token=" + resetToken 
                        + "\n\nIf you did not request a password reset, please ignore this email or contact support if you have any questions.\n\nThank you.");

            javaMailSender.send(msg);

            return ResponseEntity.ok("Password reset link sent to your email.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found.");
        }
    }


    @Override
    public void saveResetToken(String email, String token, Date expiryDate) {
        System.out.println("saveResetToken called with email: " + email + ", token: " + token);

        Account account = accountRepository.findByEmail(email);
        if (account != null) {
            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setAccount(account);
            passwordResetToken.setToken(token);
            passwordResetToken.setExpiryDate(expiryDate);
            passwordResetTokenRepository.save(passwordResetToken);
            System.out.println("Token saved for email: " + email);
        } else {
            System.out.println("Account not found for email: " + email);
        }
    }


    @Override
    public ResponseEntity<Boolean> isValidResetToken(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token);
        boolean isValid = resetToken != null && resetToken.getExpiryDate().after(new Date());
        return ResponseEntity.ok(isValid);
    }

    @Override
    public ResponseEntity<String> updatePassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        if (passwordResetToken != null) {
            Account account = passwordResetToken.getAccount();
            String hashedPassword = passwordEncoder.encode(newPassword);
            account.setPassword(hashedPassword);
            accountRepository.save(account);

            // Remove the token after updating the password
            passwordResetTokenRepository.delete(passwordResetToken);

            return ResponseEntity.ok("Password updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token.");
        }
    }
}
