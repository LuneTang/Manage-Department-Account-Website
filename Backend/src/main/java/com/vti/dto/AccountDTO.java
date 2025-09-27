package com.vti.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vti.entity.Account;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import org.springframework.hateoas.RepresentationModel;

@Data
@NoArgsConstructor
public class AccountDTO extends RepresentationModel<AccountDTO> {

    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String role;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;
    private Integer departmentId;
    private String departmentName;
}
