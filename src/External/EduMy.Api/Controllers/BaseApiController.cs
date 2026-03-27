using System.Security.Claims;
using EduMy.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    protected string CurrentUserRole =>
        User.FindFirstValue(ClaimTypes.Role)!;

    protected IActionResult ToActionResult<T>(ApiResponse<T> response)
    {
        if (response.Success)
            return Ok(response);

        return BadRequest(response);
    }

    protected IActionResult ToActionResult(ApiResponse response)
    {
        if (response.Success)
            return Ok(response);

        return BadRequest(response);
    }
}
