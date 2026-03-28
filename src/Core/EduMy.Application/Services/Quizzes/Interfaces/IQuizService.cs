using EduMy.Application.Common;
using EduMy.Application.Services.Quizzes.DTOs;

namespace EduMy.Application.Services.Quizzes.Interfaces;

public interface IQuizService
{
    Task<ApiResponse<QuizDto>> GetByModuleIdAsync(int moduleId);
    Task<ApiResponse<QuizDto>> CreateAsync(int moduleId, CreateQuizRequest request);
    Task<ApiResponse> DeleteAsync(int quizId);
    Task<ApiResponse<QuestionDto>> AddQuestionAsync(int quizId, CreateQuestionRequest request);
    Task<ApiResponse> DeleteQuestionAsync(int questionId);
    Task<ApiResponse<QuizAttemptDto>> SubmitAsync(int quizId, SubmitQuizRequest request);
    Task<ApiResponse<IEnumerable<QuizAttemptDto>>> GetAttemptsAsync(int enrollmentId, int quizId);
}
