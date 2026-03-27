using EduMy.Application.Services.Courses;
using EduMy.Application.Services.Courses.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class LecturesController : BaseApiController
{
    private readonly ILectureService _lectureService;

    public LecturesController(ILectureService lectureService)
    {
        _lectureService = lectureService;
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
        => ToActionResult(await _lectureService.GetByIdAsync(id));

    [HttpPost("module/{moduleId}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Create(int moduleId, [FromBody] LectureDto dto)
        => ToActionResult(await _lectureService.CreateAsync(moduleId, dto));

    [HttpPut("{id}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Update(int id, [FromBody] LectureDto dto)
        => ToActionResult(await _lectureService.UpdateAsync(id, dto));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _lectureService.DeleteAsync(id));

    [HttpPut("module/{moduleId}/reorder")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Reorder(int moduleId, [FromBody] IEnumerable<int> orderedIds)
        => ToActionResult(await _lectureService.ReorderAsync(moduleId, orderedIds));
}
