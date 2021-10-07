package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import com.openbeats.openbeatsdaw.model.MyUserDetails;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserManagementService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment env;

    @ResponseStatus(HttpStatus.CREATED)
    public User saveUser(User user,String siteURL) throws Exception{
        List<User> users = userRepository.findAll();

        for (User tempUser : users) {
            log.info("UserName : "+tempUser.getUsername());
            log.info(String.valueOf(user.getUsername().equals(tempUser.getUsername())));
            if(user.getEmailId().equals(tempUser.getEmailId())) throw  new Exception("User Already Exists");
        }

        String encodedPassword=passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        String randomCode = RandomString.make(64);
        user.setVerificationCode(randomCode);

        User savedUser= userRepository.save(user);
        sendVerificationEmail(user,siteURL);
        return savedUser;

    }

    private void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException, javax.mail.MessagingException {
        String toAddress = user.getEmailId();
        String fromAddress = env.getProperty("spring.mail.username");
        String senderName = "Open Beats";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "Your company name.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getFirstName());
        String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);

        if (user == null || user.isEmailVerified()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEmailVerified(true);
            userRepository.save(user);

            return true;
        }

    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmailId(email);
        user.orElseThrow(()-> new UsernameNotFoundException("User does not exist"));

        return user.map(MyUserDetails::new).get();
    }

}
