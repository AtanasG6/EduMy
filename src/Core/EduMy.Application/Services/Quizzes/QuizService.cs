using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Quizzes.DTOs;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Quizzes;

namespace EduMy.Application.Services.Quizzes;

public class QuizService : IQuizService
{
    private readonly IRepository<Quiz, int> _quizRepository;
    private readonly IRepository<QuizAttempt, int> _quizAttemptRepository;
    private readonly IRepository<Question, int> _questionRepository;

    public QuizService(
        IRepository<Quiz, int> quizRepository,
        IRepository<QuizAttempt, int> quizAttemptRepository,
        IRepository<Question, int> questionRepository)
    {
        _quizRepository = quizRepository;
        _quizAttemptRepository = quizAttemptRepository;
        _questionRepository = questionRepository;
    }

    public async Task<ApiResponse<QuizDto>> GetByModuleIdAsync(int moduleId)
    {
        var quiz = await _quizRepository.FindAsync(q => q.ModuleId == moduleId);

        if (quiz is null)
            return ApiResponse<QuizDto>.Fail("Quiz not found.");

        return ApiResponse<QuizDto>.Ok(MapToDto(quiz));
    }

    public async Task<ApiResponse<QuizAttemptDto>> SubmitAsync(int quizId, SubmitQuizRequest request)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId);

        if (quiz is null)
            return ApiResponse<QuizAttemptDto>.Fail("Quiz not found.");

        var questions = await _questionRepository.FindAllAsync(q => q.QuizId == quizId);

        var totalPoints = questions.Sum(q => q.Points);
        var earnedPoints = 0;

        foreach (var answer in request.Answers)
        {
            var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
            if (question is null) continue;

            var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
            if (correctAnswer?.Id == answer.AnswerId)
                earnedPoints += question.Points;
        }

        var score = totalPoints > 0
            ? (int)Math.Round((double)earnedPoints / totalPoints * 100)
            : 0;

        var attempt = new QuizAttempt
        {
            EnrollmentId = request.EnrollmentId,
            QuizId = quizId,
            Score = score,
            IsPassed = score >= quiz.PassingScore,
            AttemptedAt = DateTime.UtcNow,
            CompletedAt = DateTime.UtcNow
        };

        await _quizAttemptRepository.AddAsync(attempt);
        await _quizAttemptRepository.SaveChangesAsync();

        return ApiResponse<QuizAttemptDto>.Ok(MapAttemptToDto(attempt));
    }

    public async Task<ApiResponse<IEnumerable<QuizAttemptDto>>> GetAttemptsAsync(int enrollmentId, int quizId)
    {
        var attempts = await _quizAttemptRepository.FindAllAsync(
            a => a.EnrollmentId == enrollmentId && a.QuizId == quizId);

        return ApiResponse<IEnumerable<QuizAttemptDto>>.Ok(attempts.Select(MapAttemptToDto));
    }

    private static QuizDto MapToDto(Quiz quiz) => new()
    {
        Id = quiz.Id,
        Title = quiz.Title,
        Description = quiz.Description,
        PassingScore = quiz.PassingScore,
        Questions = quiz.Questions?.Select(q => new QuestionDto
        {
            Id = q.Id,
            Text = q.Text,
            Type = q.Type.ToString(),
            Points = q.Points,
            OrderIndex = q.OrderIndex,
            Answers = q.Answers?.Select(a => new AnswerDto
            {
                Id = a.Id,
                Text = a.Text,
                OrderIndex = a.OrderIndex
            }) ?? []
        }) ?? []
    };

    private static QuizAttemptDto MapAttemptToDto(QuizAttempt attempt) => new()
    {
        Id = attempt.Id,
        Score = attempt.Score,
        IsPassed = attempt.IsPassed,
        AttemptedAt = attempt.AttemptedAt,
        CompletedAt = attempt.CompletedAt
    };
}
