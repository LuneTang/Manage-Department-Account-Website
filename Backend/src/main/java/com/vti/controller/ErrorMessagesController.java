package com.vti.controller;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "api/v1/error/")
public class ErrorMessagesController {

	@Autowired
    private MessageSource messageSource;
	
	 //    Get messages error in different language
    @GetMapping("/messages")
	public String testMessages(@RequestParam(value = "key") String key){
		return messageSource.getMessage(
				key, 
				null, 
				"Default message", 
				LocaleContextHolder.getLocale());
	}
	
	@GetMapping("/messages/vi")
	public String testMessagesVi(@RequestParam(value = "key") String key){
		return messageSource.getMessage(
				key, 
				null, 
				"Default message", 
				new Locale("vi", "VN"));
	}
	
	@GetMapping("/messages/en")
	public String testMessagesEn(@RequestParam(value = "key") String key){
		return messageSource.getMessage(
				key, 
				null, 
				"Default message", 
				Locale.US);
	}
	
	@GetMapping("/messages/fr")
	public String testMessagesFr(@RequestParam(value = "key") String key){
		return messageSource.getMessage(
				key, 
				null, 
				"Default message", 
				Locale.FRANCE);
	}
	
	@GetMapping("/messages/zh_CN")
	public String testMessagesOther(@RequestParam(value = "key") String key){
		return messageSource.getMessage(
				key, 
				null, 
				"Default message", 
				Locale.SIMPLIFIED_CHINESE);
	}
}
