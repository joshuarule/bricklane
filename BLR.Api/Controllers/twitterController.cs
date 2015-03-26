using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using System.Web.Http.OData;
using System.Web.Http;
using System.Linq;
using BLR.Web.TwitterHelper;

namespace BLR.Controllers
{
    public class twitterController : ODataController
    {
        private TwitterRepository _repository = null;

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            _repository = TwitterRepository.getInstance();
        }

        [EnableQuery(EnsureStableOrdering = false)]
        public IQueryable<Tweet> GetTimeline(string screenName)
        {
            return _repository.GetTimeline(screenName).AsQueryable();
        }

        [EnableQuery(EnsureStableOrdering = false)]
        public IQueryable<Tweet> GetList(string listName)
        {
            return _repository.GetList(listName).AsQueryable();
        }
    }
}
