package com.vti.service.Auth;

import java.util.Date;

import com.vti.dto.LoginInfoDto;
import com.vti.form.Account.UpdatePasswordForm;
import com.vti.form.Authen.RegisterForm;
import com.vti.form.Authen.LoginForm;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;

public interface IAuthService {
	
	void createAccountAsNewUser(RegisterForm form);

	ResponseEntity<LoginInfoDto> verify(LoginForm form, HttpServletResponse response);

	ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);

	ResponseEntity<String> processForgotPassword(String email);
	
	void saveResetToken(String email, String token, Date expiryDate);
	
	ResponseEntity<Boolean> isValidResetToken(String token);
	
	ResponseEntity<String> updatePassword(String token, String newPassword);
}
