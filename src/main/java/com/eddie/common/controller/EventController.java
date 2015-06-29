package com.eddie.common.controller;

import com.eddie.dao.EventDao;
import com.eddie.domain.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@Transactional
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventDao eventDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Event> getEvents() {

        try {
            List<Event> events =  eventDao.list();
            System.out.println("size:" + events.size());
            return events;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}