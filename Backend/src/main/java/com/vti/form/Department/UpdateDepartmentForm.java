package com.vti.form.Department;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.vti.validation.Account.AccountIDExists;
import com.vti.validation.Department.DepartmentIDExists;
import com.vti.validation.Department.DepartmentNameNotExists;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@SuppressWarnings("ALL")
@Data
@NoArgsConstructor
public class UpdateDepartmentForm {

    @NonNull
    @DepartmentIDExists
    private Integer id;

    @NotBlank(message = "{Department.createDepartment.form.name.NotBlank}")
    @Length(max = 50, message = "{Department.createDepartment.form.name.Length}")
    private String name;

    @Pattern(regexp = "DEV|TEST|SCRUMMASTER|PM", message = "{Department.createDepartment.form.type.Pattern}")
    private String type;

    private List<Account> accounts;

    @Data
    @NoArgsConstructor
    public static class Account{

    	@NonNull
    	@AccountIDExists
        private Integer id;

        @NotBlank(message = "{Department.createDepartment.form.Account.username.NotBlank}")
        @Length(max = 50, message = "{Department.createDepartment.form.Account.username.Length}")
        private String username;

    }
}
