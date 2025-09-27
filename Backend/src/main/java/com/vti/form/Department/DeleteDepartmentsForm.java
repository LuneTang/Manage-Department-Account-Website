package com.vti.form.Department;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

import com.vti.validation.Department.DepartmentIDExists;

import io.swagger.annotations.ApiModelProperty;

@Data
@NoArgsConstructor
public class DeleteDepartmentsForm {

	@ApiModelProperty(position = 1)
	@DepartmentIDExists
    private Set<Integer> ids;
}
