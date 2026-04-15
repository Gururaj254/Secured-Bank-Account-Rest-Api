package com.Guru.BankingApp.service;

import com.Guru.BankingApp.dto.AccountDto;
import com.Guru.BankingApp.entity.Transaction;

import java.util.List;

public interface AccountService {

    AccountDto createAccount(AccountDto accountDto);

    AccountDto getAccountById(Long id);

    AccountDto deposit(Long id, double amount);

    AccountDto withdraw(Long id, double amount);

    List<AccountDto> getAllAccounts();

    void deleteAccount(Long id);

//    List<Transaction> getTransactionHistory(Long id);

    List<Transaction> findByAccountIdOrderByTimestampDesc(Long id);
}
