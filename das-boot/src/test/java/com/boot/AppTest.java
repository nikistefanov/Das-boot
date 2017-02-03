package com.boot;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

import com.boot.controller.HomeController;

public class AppTest {
    @Test
	public void testApp() {
    	HomeController hc = new HomeController();
    	String result = hc.home();
    	assertEquals(result, "<script>window.location.href = 'index.html';</script><h1>Please enable your javascript...</h1>");
    }
}
