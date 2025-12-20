package com.Guru.BankingApp.service.Impl;

import com.Guru.BankingApp.GlobalExceptionHandler.InsufficientBalanceException;
import com.Guru.BankingApp.dto.AccountDto;
import com.Guru.BankingApp.entity.Account;
import com.Guru.BankingApp.mapper.AccountMapper;
import com.Guru.BankingApp.repository.AccountRepository;
import com.Guru.BankingApp.service.AccountService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        Account account = AccountMapper.mapToAccount(accountDto);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.
                findById(id).
                orElseThrow(() -> new RuntimeException("Account does not exists")); //to throw exception
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    public AccountDto deposit(Long id, double amount) {
        Account account = accountRepository.
                findById(id).
                orElseThrow(() -> new RuntimeException("Account does not exists"));

        double total = account.getBalance() + amount;
        account.setBalance(total);
        Account saveAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(saveAccount);
    }

    @Override
    public AccountDto withdraw(Long id, double amount) {

        Account account = accountRepository.
                findById(id).
                orElseThrow(() -> new RuntimeException("Account does not exists"));
        double total = account.getBalance() - amount;
        account.setBalance(total);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return  accounts.stream().map(AccountMapper::mapToAccountDto)
                .toList();

    }

    @Override
    public void deleteAccount(Long id) {
        Account account = accountRepository.
                findById(id).
                orElseThrow(() -> new RuntimeException("Account does not exists"));
    accountRepository.deleteById(id);
    }
}
