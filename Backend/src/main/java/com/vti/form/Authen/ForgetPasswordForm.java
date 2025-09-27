package com.vti.form.Authen;

import org.hibernate.validator.constraints.Length;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ForgetPasswordForm {

	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
    private String newPassword;

	@NotBlank(message = "{Account.createAccount.form.password.NotBlank}")
    @Length(max = 800, message = "{Account.createAccount.form.password.Length}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$", 
    			message = "{Account.createAccount.form.password.Pattern}")
	private String confirmPassword;
}
