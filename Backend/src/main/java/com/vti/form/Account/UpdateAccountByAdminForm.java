package com.vti.form.Account;

import com.vti.validation.Account.AccountIDExists;
import com.vti.validation.Department.DepartmentIDExists;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateAccountByAdminForm {
	
	@AccountIDExists
	private Integer id;
	
	@DepartmentIDExists
	private Integer departmentId;
	
	@NotBlank(message = "{Account.createAccount.form.role.NotBlank}")
	@Pattern(regexp = "ADMIN|MANAGER|EMPLOYEE", message = "{Account.createAccount.form.role.Pattern}")
	private String role;
}
