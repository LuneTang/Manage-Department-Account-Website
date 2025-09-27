package com.vti.dto;

import lombok.Data;

@Data
public class LoginInfoDto {
	
	private int id;
	
	private String fullName;
	
	private String departmentName;
	
	private String role;
	
	private String token;
}
