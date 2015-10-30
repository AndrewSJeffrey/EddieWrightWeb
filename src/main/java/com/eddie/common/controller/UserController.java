package com.eddie.common.controller;

import com.eddie.common.service.EmailService;
import com.eddie.common.service.PasswordGenerator;
import com.eddie.dao.UserDao;
import com.eddie.domain.User;
import org.apache.commons.mail.EmailException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Controller
@Transactional
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public
    @ResponseBody
    List<User> allUsers() {
        try {
            List<User> users = userDao.list();
            for (User user : users) {

            }
            //simulate delays
            //  Thread.sleep(1000);
            if (users == null) {
                return null;
            } else {
                return users;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    @RequestMapping(value = "/getByRole", method = RequestMethod.GET)
    public
    @ResponseBody
    List<User> getByRole(@RequestParam(value = "role") String role) {
        try {
            List<User> users = userDao.findByRole(role);
            if (users == null) {
                return null;
            } else {
                return users;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.GET)
    public
    @ResponseBody
    User getUser(@RequestParam(value = "id") int id) {
        return userDao.load(id);
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public User create(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setId(null);
        user.setDateCreated(dateNow);
        user.setDateModified(dateNow);
        resetPassword(user);
        user.setRemoved(false);
        userDao.save(user);
        return user;
    }
    

    @ResponseBody
    @RequestMapping(value = "/delete", method = {RequestMethod.POST})
    public User delete(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setDateModified(dateNow);
        user.setRemoved(true);
        userDao.save(user);
        return user;
    }

    @ResponseBody
    @RequestMapping(value = "/restore", method = {RequestMethod.POST})
    public User restore(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setDateModified(dateNow);
        user.setRemoved(false);
        userDao.save(user);
        return user;
    }

    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public User update(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setDateModified(dateNow);
        userDao.save(user);
        return user;
    }

    @ResponseBody
    @RequestMapping(value = "/resetPassword", method = {RequestMethod.POST})
    public User resetPasswordViaEmail(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setDateModified(dateNow);
        resetPassword(user);
        userDao.save(user);
        return user;
    }


    public void resetPassword(final User user) {
        String password = PasswordGenerator.generatePassword();
        user.setPassword(password);
        StringBuilder resetPasswordEmail = new StringBuilder();
        resetPasswordEmail.append("Dear ");
        resetPasswordEmail.append(user.getFirstname());
        resetPasswordEmail.append(", Your login details are:\n");
        resetPasswordEmail.append("Username: ");
        resetPasswordEmail.append(user.getUsername());
        resetPasswordEmail.append("\n");
        resetPasswordEmail.append("Password: ");
        resetPasswordEmail.append(user.getPassword());
        resetPasswordEmail.append("\n");
        resetPasswordEmail.append("Please log in here: ");
        resetPasswordEmail.append("http://localhost:8080 \n");
        try {
            EmailService.sendEmail("Password has been reset", resetPasswordEmail.toString(), user.getEmail());
        } catch (EmailException e) {
            e.printStackTrace();
        }
    }

}


