package com.openbeats.openbeatsdaw.config;

import com.openbeats.openbeatsdaw.Service.CustomOAuth2UserService;
import com.openbeats.openbeatsdaw.Service.OAuth2AuthenticationSuccessHandler;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private static List<String> clients = Arrays.asList("spotify", "Apple");

    @Autowired
    UserManagementService userManagementService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProviderDB());
    }


    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authProviderDB() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(new BCryptPasswordEncoder());
        authenticationProvider.setUserDetailsService(userManagementService);
        return authenticationProvider;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors()
                .and().authorizeRequests()
                .antMatchers("/createUser").permitAll()
                .antMatchers("/verify").permitAll()
                .antMatchers("/").permitAll()
                .anyRequest().authenticated().and().httpBasic()
                .and().oauth2Login()
                .userInfoEndpoint()
                .userService(customOAuth2UserService)
                .and().successHandler(oAuth2AuthenticationSuccessHandler)
                .and().logout()
                .and().csrf().disable();

    }


    @Bean
    public OAuth2AuthorizedClientService authorizedClientService() {

        return new InMemoryOAuth2AuthorizedClientService(
                clientRegistrationRepository());
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = clients.stream()
                .map(c -> getRegistration(c))
                .filter(registration -> registration != null)
                .collect(Collectors.toList());

        return new InMemoryClientRegistrationRepository(registrations);
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    private ClientRegistration getRegistration(String client) {

        // @formatter:off

            if(client.equals("spotify"))
                return ClientRegistration
                        .withRegistrationId("spotify")
                        .clientId("dcacba0fd9fe4b10886bff0215a2d94a")
                        .clientSecret("463cdcd58a3641a798a20c3e6da8036a")
                        .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                        .redirectUri("http://localhost:8655/login/oauth2/code/spotify")
                        .scope("user-read-private", "user-read-email")
                        .authorizationUri("https://accounts.spotify.com/authorize")
                        .tokenUri("https://accounts.spotify.com/api/token")
                        .userInfoUri("https://api.spotify.com/v1/me")
                        .userNameAttributeName("display_name")
                        .clientName("spotify")
                        .build();
            else
                return ClientRegistration
                        .withRegistrationId("apple")
                        .clientId("dcacba0fd9fe4b10886bff0215a2d94a")
                        .clientSecret("463cdcd58a3641a798a20c3e6da8036a")
                        .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                        .redirectUri("http://localhost:8655/login/oauth2/code/spotify")
                        .scope("user-read-private", "user-read-email")
                        .authorizationUri("https://accounts.spotify.com/authorize")
                        .tokenUri("https://accounts.spotify.com/api/token")
                        .userInfoUri("https://api.spotify.com/v1/me")
                        .userNameAttributeName("display_name")
                        .clientName("spotify")
                        .build();
        // @formatter:on
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}