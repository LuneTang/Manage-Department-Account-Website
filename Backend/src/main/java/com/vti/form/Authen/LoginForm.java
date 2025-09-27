package com.vti.form.Authen;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Account.UsernameExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LoginForm {

	@NotBlank(message = "{Account.createAccount.form.username.NotBlank}")
    @Length(max = 50, message = "{Account.createAccount.form.username.Length}")
	@UsernameExists
	private String username;
	
	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?#&])[A-Za-z\\d@$!%*#?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
	private String password;
	
	private boolean rememberMe;
}
