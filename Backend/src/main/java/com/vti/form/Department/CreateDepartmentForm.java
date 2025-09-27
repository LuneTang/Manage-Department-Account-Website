package com.vti.form.Department;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Department.DepartmentNameNotExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("ALL")
@Data
@NoArgsConstructor
public class CreateDepartmentForm {

    @NotBlank(message = "{Department.createDepartment.form.name.NotBlank}")
    @Length(max = 50, message = "{Department.createDepartment.form.name.Length}")
    @DepartmentNameNotExists
    private String name;

    @Pattern(regexp = "DEV|TEST|SCRUMMASTER|PM", message = "{Department.createDepartment.form.type.Pattern}")
    private String type;

    @NotEmpty(message = "{Department.createDepartment.form.accounts.NotEmpty}")
    private List<Account> accounts;

    @Data
    @NoArgsConstructor
    public static class Account{

    	@NotBlank(message = "{Department.createDepartment.form.Account.username.NotBlank}")
        @Length(max = 50, message = "{Department.createDepartment.form.Account.username.Length}")
        private String username;

    }
}
