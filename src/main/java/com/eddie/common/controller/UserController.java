package com.eddie.common.controller;

import com.eddie.LiveChat;
import com.eddie.dao.UserDao;
import com.eddie.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@Controller
@Transactional
@RequestMapping("/login")
public class UserController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    User getUser(@RequestParam(value = "user") String username, @RequestParam(value = "password") String password) {
        try {
            User user = userDao.findByUsernameAndPassword(username, password);
            //simulate delays
            Thread.sleep(1000);
            if (user == null) {
                return null;
            } else {
                return user;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}


