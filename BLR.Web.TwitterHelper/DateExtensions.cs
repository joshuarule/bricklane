using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLR.Web.TwitterHelper
{
    public static class DateExtensions
    {
        public static string GetTimeSinceNow(this DateTime date)
        {
            DateTime currentTime = DateTime.UtcNow;
            DateTime dateToConvert = TimeZoneInfo.ConvertTimeToUtc(date);

            TimeSpan span = currentTime.Subtract(dateToConvert);

            if (span.TotalDays > 365)
                return string.Format("{0} years ago", Math.Round((span.TotalDays / 365)));

            if (span.TotalDays > 30)
                return string.Format("{0} months ago", Math.Round((span.TotalDays / 30)));

            if (span.TotalDays > 1)
                return string.Format("{0} days ago", Math.Round(span.TotalDays));

            if (span.TotalHours > 1)
                return string.Format("{0} hours ago", Math.Round(span.TotalHours));

            if (span.TotalMinutes > 1)
                return string.Format("{0} minutes ago", Math.Round(span.TotalMinutes));

            if (span.TotalSeconds > 1)
                return string.Format("{0} seconds ago", Math.Round(span.TotalSeconds));

            return "a moment ago";
        }
    }
}
