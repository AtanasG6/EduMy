using EduMy.Application.Services.Quizzes;
using EduMy.Application.Services.Quizzes.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

[Authorize]
public class QuizzesController : BaseApiController
{
    private readonly IQuizService _quizService;

    public QuizzesController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpGet("module/{moduleId}")]
    public async Task<IActionResult> GetByModule(int moduleId)
        => ToActionResult(await _quizService.GetByModuleIdAsync(moduleId));

    [HttpPost("{quizId}/submit")]
    public async Task<IActionResult> Submit(int quizId, [FromBody] SubmitQuizRequest request)
        => ToActionResult(await _quizService.SubmitAsync(quizId, request));

    [HttpGet("{quizId}/attempts")]
    public async Task<IActionResult> GetAttempts(int quizId, [FromQuery] int enrollmentId)
        => ToActionResult(await _quizService.GetAttemptsAsync(enrollmentId, quizId));
}
