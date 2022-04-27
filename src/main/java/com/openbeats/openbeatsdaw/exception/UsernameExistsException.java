package com.openbeats.openbeatsdaw.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "username exists")
public class UsernameExistsException extends Exception {
    public UsernameExistsException(String message) {

        super(message);
    }
}
