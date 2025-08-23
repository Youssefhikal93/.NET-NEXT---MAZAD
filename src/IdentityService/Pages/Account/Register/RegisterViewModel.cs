using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Pages.Account.Register;

public class RegisterViewModel
{
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string UserName { get; set; }
    public string? FullName { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    public string ReturnUrl { get; set; }
    public string Button { get; set; }
}
