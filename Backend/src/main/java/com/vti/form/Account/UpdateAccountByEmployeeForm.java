package com.vti.form.Account;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Account.AccountIDExists;
import com.vti.validation.Account.EmailNotExists;
import com.vti.validation.Account.UsernameNotExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateAccountByEmployeeForm {
	
	@AccountIDExists
	private Integer id;
	
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
	
}
