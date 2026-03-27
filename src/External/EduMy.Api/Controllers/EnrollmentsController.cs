using EduMy.Application.Services.Enrollments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

[Authorize]
public class EnrollmentsController : BaseApiController
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMy()
        => ToActionResult(await _enrollmentService.GetByStudentIdAsync(CurrentUserId));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => ToActionResult(await _enrollmentService.GetByIdAsync(id));

    [HttpPost("course/{courseId}")]
    public async Task<IActionResult> Enroll(int courseId)
        => ToActionResult(await _enrollmentService.EnrollAsync(CurrentUserId, courseId));

    [HttpPost("{enrollmentId}/lectures/{lectureId}/complete")]
    public async Task<IActionResult> MarkLectureComplete(
        int enrollmentId,
        int lectureId,
        [FromBody] MarkCompleteRequest request)
        => ToActionResult(await _enrollmentService.MarkLectureCompleteAsync(
            enrollmentId, lectureId, request.WatchTimeSeconds));
}

public record MarkCompleteRequest(int WatchTimeSeconds);
