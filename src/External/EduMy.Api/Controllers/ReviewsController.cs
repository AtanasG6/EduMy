using EduMy.Application.Services.Reviews;
using EduMy.Application.Services.Reviews.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class ReviewsController : BaseApiController
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
        => ToActionResult(await _reviewService.GetByCourseIdAsync(courseId));

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
        => ToActionResult(await _reviewService.CreateAsync(CurrentUserId, request));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _reviewService.DeleteAsync(id));
}
