package com.vti.form.Account;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Account.AccountIDExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UpdatePasswordForm {
	
	@AccountIDExists
	private int id;

	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
    private String oldPassword;

	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
	private String newPassword;
}
