package com.eddie.common.controller;

import com.eddie.dao.SourceDao;
import com.eddie.domain.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

@Controller
@Transactional
@RequestMapping("/sources")
public class SourceController {

    @Autowired
    private SourceDao sourceDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Source> getEvents() {

        try {
            List<Source> sources = sourceDao.list();
            return sources;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Source create(@RequestBody final Source source) {
        final Date dateNow = new Date();
        source.setId(null);
        sourceDao.save(source);
        return source;
    }

    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public Source update(@RequestBody final Source source) {
        final Date dateNow = new Date();
        sourceDao.save(source);
        return source;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = {RequestMethod.POST})
    public Source delete(@RequestBody final Source source) {
        final Date dateNow = new Date();
        sourceDao.save(source);
        return source;
    }

    @ResponseBody
    @RequestMapping(value = "/restore", method = {RequestMethod.POST})
    public Source restore(@RequestBody final Source source) {
        final Date dateNow = new Date();
        sourceDao.save(source);
        return source;
    }
}