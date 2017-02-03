package com.boot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@RequestMapping("/")
	public String home() {
		return "<script>window.location.href = 'index.html';</script><h1>Please enable your javascript...</h1>";
	}
}
