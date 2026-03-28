using EduMy.Application.Services.Quizzes.Interfaces;
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

    [HttpPost("module/{moduleId}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Create(int moduleId, [FromBody] CreateQuizRequest request)
        => ToActionResult(await _quizService.CreateAsync(moduleId, request));

    [HttpDelete("{quizId}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Delete(int quizId)
        => ToActionResult(await _quizService.DeleteAsync(quizId));

    [HttpPost("{quizId}/questions")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> AddQuestion(int quizId, [FromBody] CreateQuestionRequest request)
        => ToActionResult(await _quizService.AddQuestionAsync(quizId, request));

    [HttpDelete("{quizId}/questions/{questionId}")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> DeleteQuestion(int quizId, int questionId)
        => ToActionResult(await _quizService.DeleteQuestionAsync(questionId));

    [HttpPost("{quizId}/submit")]
    public async Task<IActionResult> Submit(int quizId, [FromBody] SubmitQuizRequest request)
        => ToActionResult(await _quizService.SubmitAsync(quizId, request));

    [HttpGet("{quizId}/attempts")]
    public async Task<IActionResult> GetAttempts(int quizId, [FromQuery] int enrollmentId)
        => ToActionResult(await _quizService.GetAttemptsAsync(enrollmentId, quizId));
}
