using EduMy.Application.Services.Auth.Interfaces;
using EduMy.Application.Services.Auth.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
        => ToActionResult(await _authService.LoginAsync(request));

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        => ToActionResult(await _authService.RegisterAsync(request));
}
