using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http;
using BLR.Web.TwitterHelper;
using System.Web.Http.Cors;

namespace BLR.Controllers
{
    public class twitterController : ApiController
    {
        private TwitterRepository _repository = null;

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            _repository = TwitterRepository.getInstance();
        }

        [Queryable(EnsureStableOrdering = false)]
        [EnableCors("*","*","*")]
        public IEnumerable<Tweet> GetTimeline(string screenName)
        {
            return _repository.GetTimeline(screenName);
        }

        [Queryable(EnsureStableOrdering = false)]
        [EnableCors("*", "*", "*")]
        public IEnumerable<Tweet> GetList(string listName)
        
        {
            return _repository.GetList(listName);
        }
    }
}
