package com.openbeats.openbeatsdaw.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /*@Autowired
    CallHandler groupCallHandler;

    @Autowired
    HelloWorldRecHandler handler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(groupCallHandler, "/groupcall").setAllowedOrigins("*");
        registry.addHandler(handler, "/recording").setAllowedOrigins("*");
    }*/

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //registry.addEndpoint("/studioSession").setAllowedOrigins("http://openbeats--frontend.s3-website.us-east-2.amazonaws.com/").withSockJS();
        registry.addEndpoint("/studioSession").setAllowedOrigins("http://localhost:3000").withSockJS();
        //registry.addEndpoint("/studioSession").setAllowedOrigins("https://d2truiiempih7a.cloudfront.net").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app").enableSimpleBroker("/topic");
        registry.enableSimpleBroker("/topic/session-progress");
    }
}
