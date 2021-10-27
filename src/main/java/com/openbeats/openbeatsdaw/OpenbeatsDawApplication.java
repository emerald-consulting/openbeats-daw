package com.openbeats.openbeatsdaw;

import com.openbeats.openbeatsdaw.KurentoMediaServer.CallHandler;
import com.openbeats.openbeatsdaw.KurentoMediaServer.RoomManager;
import com.openbeats.openbeatsdaw.KurentoMediaServer.UserRegistry;
import org.kurento.client.KurentoClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@SpringBootApplication
@EnableWebSocket
public class OpenbeatsDawApplication implements WebSocketConfigurer {

    @Bean
    public UserRegistry userRegistry() {
        return new UserRegistry();
    }

    @Bean
    public RoomManager roomManager() {
        return new RoomManager();
    }

    @Bean
    public CallHandler callHandler() {
        return new CallHandler();
    }

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }

    @Bean
    public ServletServerContainerFactoryBean createServletServerContainerFactoryBean_groupcall() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(32768);
        return container;
    }
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(callHandler(), "/groupcall").setAllowedOrigins("*");
    }

    public static void main(String[] args) {
        SpringApplication.run(OpenbeatsDawApplication.class, args);
    }

}
