using EduMy.Application.Services.Courses.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class ModulesController : BaseApiController
{
    private readonly IModuleService _moduleService;

    public ModulesController(IModuleService moduleService)
    {
        _moduleService = moduleService;
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
        => ToActionResult(await _moduleService.GetByCourseIdAsync(courseId));

    [HttpPost("course/{courseId}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Create(int courseId, [FromBody] CreateModuleRequest request)
        => ToActionResult(await _moduleService.CreateAsync(courseId, request.Title, request.Description));

    [HttpPut("{id}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateModuleRequest request)
        => ToActionResult(await _moduleService.UpdateAsync(id, request.Title, request.Description));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _moduleService.DeleteAsync(id));

    [HttpPut("course/{courseId}/reorder")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Reorder(int courseId, [FromBody] IEnumerable<int> orderedIds)
        => ToActionResult(await _moduleService.ReorderAsync(courseId, orderedIds));
}

public record CreateModuleRequest(string Title, string? Description);
public record UpdateModuleRequest(string Title, string? Description);
