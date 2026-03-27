using EduMy.Application.Common;
using EduMy.Application.Services.Quizzes.DTOs;

namespace EduMy.Application.Services.Quizzes;

public interface IQuizService
{
    Task<ApiResponse<QuizDto>> GetByModuleIdAsync(int moduleId);
    Task<ApiResponse<QuizAttemptDto>> SubmitAsync(int quizId, SubmitQuizRequest request);
    Task<ApiResponse<IEnumerable<QuizAttemptDto>>> GetAttemptsAsync(int enrollmentId, int quizId);
}
