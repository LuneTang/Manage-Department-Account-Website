package com.vti.form.Authen;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Account.EmailNotExists;
import com.vti.validation.Account.UsernameNotExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterForm {
	
	@NotBlank(message = "{Account.createAccount.form.firstName.NotBlank}")
    @Length(max = 50, message = "{Account.createAccount.form.firstName.Length}")
	private String firstName;
	
	@NotBlank(message = "{Account.createAccount.form.lastName.NotBlank}")
    @Length(max = 50, message = "{Account.createAccount.form.lastName.Length}")
	private String lastName;
	
	@NotBlank(message = "{Account.createAccount.form.email.NotBlank}")
    @Length(max = 100, message = "{Account.createAccount.form.email.Length}")
	@Email(message = "{Account.createAccount.form.email.Format}")
	@EmailNotExists
	private String email;
	
	@NotBlank(message = "{Account.createAccount.form.username.NotBlank}")
    @Length(max = 50, message = "{Account.createAccount.form.username.Length}")
	@UsernameNotExists
	private String username;
	
	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%#*?&])[A-Za-z\\d@$!%#*?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
	private String password;
}
