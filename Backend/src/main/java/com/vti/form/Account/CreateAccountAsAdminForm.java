package com.vti.form.Account;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import com.vti.form.Authen.RegisterForm;
import com.vti.validation.Department.DepartmentIDExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateAccountAsAdminForm extends RegisterForm {

	@DepartmentIDExists
	private Integer departmentId;
	
	@NotBlank(message = "{Account.createAccount.form.role.NotBlank}")
	@Pattern(regexp = "(?i)Admin|Manager|Employee", message = "{Account.createAccount.form.role.Pattern}")
	private String role;
}
