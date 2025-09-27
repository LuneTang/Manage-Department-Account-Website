package com.vti.form.Department;

import com.vti.entity.Department;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor
public class FilterDepartmentForm {

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date minCreatedDate;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date maxCreatedDate;

    private Department.Type type;
}
