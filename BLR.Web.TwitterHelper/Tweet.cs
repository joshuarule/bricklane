using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BLR.Web.TwitterHelper
{
    [DataContract]
    public class Tweet
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string ScreenName { get; set; }

        [DataMember]
        public string TimeSinceNow { get; set; }

        [DataMember]
        public string Text { get; set; }

        public DateTime PostedOn { get; set; }

        public ulong StatusId { get; set; }
    }
}
