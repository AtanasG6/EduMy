using EduMy.Application.Services.Quizzes.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Quizzes.DTOs;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Quizzes;
using EduMy.Domain.Enums;

namespace EduMy.Application.Services.Quizzes.Implementations;

public class QuizService : IQuizService
{
    private readonly IRepository<Quiz, int> _quizRepository;
    private readonly IRepository<QuizAttempt, int> _quizAttemptRepository;
    private readonly IRepository<Question, int> _questionRepository;
    private readonly IRepository<Answer, int> _answerRepository;

    public QuizService(
        IRepository<Quiz, int> quizRepository,
        IRepository<QuizAttempt, int> quizAttemptRepository,
        IRepository<Question, int> questionRepository,
        IRepository<Answer, int> answerRepository)
    {
        _quizRepository = quizRepository;
        _quizAttemptRepository = quizAttemptRepository;
        _questionRepository = questionRepository;
        _answerRepository = answerRepository;
    }

    public async Task<ApiResponse<QuizDto>> GetByModuleIdAsync(int moduleId)
    {
        var quiz = await _quizRepository.FindAsync(q => q.ModuleId == moduleId, "Questions", "Questions.Answers");

        if (quiz is null)
            return ApiResponse<QuizDto>.Fail("Quiz not found.");

        return ApiResponse<QuizDto>.Ok(MapToDto(quiz));
    }

    public async Task<ApiResponse<QuizDto>> CreateAsync(int moduleId, CreateQuizRequest request)
    {
        var existing = await _quizRepository.FindAsync(q => q.ModuleId == moduleId);
        if (existing is not null)
            return ApiResponse<QuizDto>.Fail("This module already has a quiz.");

        var quiz = new Quiz
        {
            ModuleId = moduleId,
            Title = request.Title,
            Description = request.Description,
            PassingScore = request.PassingScore,
            OrderIndex = 1
        };

        await _quizRepository.AddAsync(quiz);
        await _quizRepository.SaveChangesAsync();

        return ApiResponse<QuizDto>.Ok(MapToDto(quiz), "Quiz created.");
    }

    public async Task<ApiResponse> DeleteAsync(int quizId)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId);
        if (quiz is null)
            return ApiResponse.Fail("Quiz not found.");

        _quizRepository.Delete(quiz);
        await _quizRepository.SaveChangesAsync();
        return ApiResponse.Ok("Quiz deleted.");
    }

    public async Task<ApiResponse<QuestionDto>> AddQuestionAsync(int quizId, CreateQuestionRequest request)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId);
        if (quiz is null)
            return ApiResponse<QuestionDto>.Fail("Quiz not found.");

        var count = await _questionRepository.CountAsync(q => q.QuizId == quizId);

        var question = new Question
        {
            QuizId = quizId,
            Text = request.Text,
            Type = QuestionType.MultipleChoice,
            Points = request.Points,
            OrderIndex = count + 1
        };

        await _questionRepository.AddAsync(question);
        await _questionRepository.SaveChangesAsync();

        foreach (var a in request.Answers)
        {
            var answer = new Answer
            {
                QuestionId = question.Id,
                Text = a.Text,
                IsCorrect = a.IsCorrect,
                OrderIndex = request.Answers.ToList().IndexOf(a) + 1
            };
            await _answerRepository.AddAsync(answer);
        }

        await _answerRepository.SaveChangesAsync();

        var loaded = await _questionRepository.GetByIdAsync(question.Id, "Answers");

        return ApiResponse<QuestionDto>.Ok(new QuestionDto
        {
            Id = question.Id,
            Text = question.Text,
            Type = question.Type.ToString(),
            Points = question.Points,
            OrderIndex = question.OrderIndex,
            Answers = loaded?.Answers?.Select(a => new AnswerDto { Id = a.Id, Text = a.Text, OrderIndex = a.OrderIndex }) ?? []
        }, "Question added.");
    }

    public async Task<ApiResponse> DeleteQuestionAsync(int questionId)
    {
        var question = await _questionRepository.GetByIdAsync(questionId);
        if (question is null)
            return ApiResponse.Fail("Question not found.");

        _questionRepository.Delete(question);
        await _questionRepository.SaveChangesAsync();
        return ApiResponse.Ok("Question deleted.");
    }

    public async Task<ApiResponse<QuizAttemptDto>> SubmitAsync(int quizId, SubmitQuizRequest request)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId, "Questions", "Questions.Answers");

        if (quiz is null)
            return ApiResponse<QuizAttemptDto>.Fail("Quiz not found.");

        var totalPoints = quiz.Questions.Sum(q => q.Points);
        var earnedPoints = 0;

        foreach (var answer in request.Answers)
        {
            var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
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

        return ApiResponse<QuizAttemptDto>.Ok(MapAttemptToDto(attempt), "Quiz submitted.");
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
