using EduMy.Application.Services.Courses.Interfaces;
using EduMy.Application.Services.Courses.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class CoursesController : BaseApiController
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CourseFilterRequest filter)
        => ToActionResult(await _courseService.GetAllAsync(filter));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => ToActionResult(await _courseService.GetByIdAsync(id));

    [HttpPost]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Create([FromBody] CreateCourseRequest request)
        => ToActionResult(await _courseService.CreateAsync(CurrentUserId, request));

    [HttpPut("{id}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseRequest request)
        => ToActionResult(await _courseService.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Lecturer,Admin")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _courseService.DeleteAsync(id));

    [HttpPut("{id}/publish")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Publish(int id)
        => ToActionResult(await _courseService.PublishAsync(id));

    [HttpPut("{id}/archive")]
    [Authorize(Roles = "Lecturer,Admin")]
    public async Task<IActionResult> Archive(int id)
        => ToActionResult(await _courseService.ArchiveAsync(id));
}
