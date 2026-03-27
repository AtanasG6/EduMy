using EduMy.Application.Services.Users.Interfaces;
using EduMy.Application.Services.Users.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
        => ToActionResult(await _userService.GetByIdAsync(CurrentUserId));

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserRequest request)
        => ToActionResult(await _userService.UpdateAsync(CurrentUserId, request));

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        => ToActionResult(await _userService.ChangePasswordAsync(CurrentUserId, request));

    [HttpPut("{id}/block")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Block(int id)
        => ToActionResult(await _userService.BlockAsync(id));

    [HttpPut("{id}/unblock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Unblock(int id)
        => ToActionResult(await _userService.UnblockAsync(id));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _userService.DeleteAsync(id));
}
