package com.Guru.BankingApp.GlobalExceptionHandler;


public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }
}
