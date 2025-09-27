package com.vti.form.Account;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import com.vti.entity.Account.Role;
import com.vti.validation.Department.DepartmentNameExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FilterAccountForm {

	@NotBlank(message = "{Account.createAccount.form.role.NotBlank}")
	@Pattern(regexp = "ADMIN|MANAGER|EMPLOYEE", message = "{Account.createAccount.form.role.Pattern}")
    private Role role;

	@DepartmentNameExists
    private String departmentName;
}
