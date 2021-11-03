package com.openbeats.openbeatsdaw;

<<<<<<< Updated upstream
import com.openbeats.openbeatsdaw.KurentoMediaServer.groupcall.CallHandler;
import com.openbeats.openbeatsdaw.KurentoMediaServer.record.HelloWorldRecHandler;
import org.springframework.beans.factory.annotation.Autowired;
=======
import org.kurento.client.KurentoClient;
>>>>>>> Stashed changes
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
public class OpenbeatsDawApplication  {


<<<<<<< Updated upstream
    @Autowired
    CallHandler groupCallHandler;

    @Autowired
    HelloWorldRecHandler handler;

    public static void main(String[] args) throws Exception {
        SpringApplication.run(OpenbeatsDawApplication.class, args);
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(groupCallHandler, "/groupcall").setAllowedOrigins("*");
        registry.addHandler(handler, "/recording").setAllowedOrigins("*");
    }
=======


>>>>>>> Stashed changes


}
