using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserRegPanel.Models
{
    public class UnconfirmedUsers
    {
        public string userEmail { get; set; }
        public string userName { get; set; }
        public string name { get; set; }
        public string lastName { get; set; }
        public string userPassword { get; set; }
    }
}