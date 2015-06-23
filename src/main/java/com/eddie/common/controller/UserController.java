package com.eddie.common.controller;

import com.eddie.LiveChat;
import com.eddie.dao.UserDao;
import com.eddie.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public User create(@RequestBody final User user) {
        final Date dateNow = new Date();
        user.setId(null);
        user.setDateCreated(dateNow);
        user.setDateModified(dateNow);
        user.setPassword("password");
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

}


