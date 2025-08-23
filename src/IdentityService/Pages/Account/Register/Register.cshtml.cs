using System.Security.Claims;
using Duende.IdentityModel;
using IdentityService.Models;
using IdentityService.Pages.Account.Register;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityService.Pages.Account
{
    [AllowAnonymous]
    [SecurityHeaders]
    public class RegisterModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
         [BindProperty]
        public RegisterViewModel Input { get; set; }
        [BindProperty]
        public bool RegisterSuccess { get; set; }
        public RegisterModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
       
        public IActionResult OnGet(string returnUrl)
        {
            Input = new RegisterViewModel
            {
                ReturnUrl = returnUrl
            };
            return Page();
        }

        public async Task<IActionResult> OnPost()
        {
            if (Input.Button != "register") return Redirect("~/");

            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = Input.UserName,
                    Email = Input.Email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, Input.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddClaimsAsync(user, new Claim[]{
                        new Claim(JwtClaimTypes.GivenName,Input.FirstName),
                        new Claim(JwtClaimTypes.FamilyName,Input.LastName),
                        new Claim(JwtClaimTypes.Name,$"{Input.FirstName} {Input.LastName}"),

                    });
                    
                    RegisterSuccess = true;
                }
            }
                            return Page();

        }
    }
}
