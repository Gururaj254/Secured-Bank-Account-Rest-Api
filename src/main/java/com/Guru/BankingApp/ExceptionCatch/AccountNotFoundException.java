package com.Guru.BankingApp.ExceptionCatch;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String message) {
        super(message);
    }
}
