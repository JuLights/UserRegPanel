using System;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using UserRegPanel.Models;

namespace UserRegPanel.Controllers
{
    public class AccountController : Controller
    {

        string Auth = "kshadkasd";

        MyConnectionDataContext db = new MyConnectionDataContext();
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Registration()
        {
            return View();
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult CheckEmailAvailability(string userdata) //emailCheck
        {
            var SearchData = db.ConfirmedUsers.Where(x => x.Email == userdata).FirstOrDefault();
            if (SearchData != null)
            {
                return Json(0);
            }
            else
            {
                return Json(1);
            }
        }

        public JsonResult CheckUserAvailability(string userdata)  //userCheck
        {
            var SearchData = db.ConfirmedUsers.Where(x => x.Username == userdata).FirstOrDefault();
            if (SearchData != null)
            {
                return Json(1);
            }
            else
            {
                return Json(0);
            }
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult Registration(UnconfirmedUsers userdata)
        {

            if (userdata != null)
            {
                db.UnconfirmedUsers.InsertOnSubmit(new UnconfirmedUser()
                {
                    Name = userdata.name,
                    Username = userdata.userName,
                    Email = userdata.userEmail,
                    LastName = userdata.lastName,
                    Password = ConvertStringtoMD5(userdata.userPassword + Auth),
                    SecretAnswer = ConvertStringtoMD5(userdata.userPassword + Auth),
                });
                db.SubmitChanges();

                string subject = "Confirmation";
                string body = "please do check confirmation link: https://localhost:44391/Account/Confirmation/" + ConvertStringtoMD5(userdata.userPassword + Auth);
                SendMail(userdata.userEmail, subject, body);

                return Json(1);
            }
            else
            {
                return Json(0);
            }
        }

        public ActionResult Confirmation(string id)
        {
            var UU = db.UnconfirmedUsers.Where(x => x.SecretAnswer == id).FirstOrDefault();

            if(UU == null)
            {
                return Content("Link is not correct!");
            }
            else
            {
                db.ConfirmedUsers.InsertOnSubmit(new ConfirmedUser
                {
                    Email = UU.Email,
                    Name = UU.Name,
                    LastName = UU.LastName,
                    Username = UU.Username,
                    Password = UU.Password,
                    SecretAnswer = UU.SecretAnswer,
                    CreateDate = DateTime.Now,
                });
                db.SubmitChanges();
                db.UnconfirmedUsers.DeleteAllOnSubmit(db.UnconfirmedUsers.Where(x => x.Email == UU.Email));
                db.SubmitChanges();

                return RedirectToAction("Login","Account");
            }
        }

        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string Email, string Password)
        {
            var user = db.ConfirmedUsers.Where(x => x.Email == Email).FirstOrDefault();
            if (user != null && ConvertStringtoMD5(Password)==user.Password)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewBag.error = "try again.";
                return View();
            }
        }

        public static bool SendMail(string userMail, string subject, string body, bool isHtml = false)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.IsBodyHtml = isHtml;
                mail.From = new MailAddress("jugeljke@gmail.com");
                mail.To.Add(userMail);
                mail.Subject = subject;
                mail.Body = body;

                SmtpClient SmtpServer = new SmtpClient("smtp-relay.sendinblue.com", 587);
                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("jugeljke@gmail.com", "yhfwgWx2OD3cb8NS");
                SmtpServer.EnableSsl = false;

                SmtpServer.Send(mail);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static string ConvertStringtoMD5(string strword)
        {
            MD5 md5 = MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(strword);
            byte[] hash = md5.ComputeHash(inputBytes);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("x2"));
            }
            return sb.ToString();
        }

    }

}
