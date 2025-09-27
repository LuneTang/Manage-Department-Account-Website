package com.vti.form.Account;

import java.util.Set;

import com.vti.validation.Account.AccountIDExists;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DeleteAccountsForm {
	
	@AccountIDExists
	private Set<Integer> ids;

}
