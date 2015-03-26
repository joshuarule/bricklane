﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;

namespace BLR.WebApi
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            ConfigureApi(GlobalConfiguration.Configuration);
        }

        protected void ConfigureApi(HttpConfiguration config)
        {
            // Remove the XML formatter
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            var encondings = config.Formatters.JsonFormatter.SupportedEncodings.ToArray();
            
            foreach (Encoding item in encondings)
            {
                config.Formatters.JsonFormatter.SupportedEncodings.Remove(item);
            }

            config.Formatters.JsonFormatter.SupportedEncodings.Add(Encoding.GetEncoding("utf-16"));
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }
    }
}