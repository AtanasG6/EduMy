namespace EduMy.Application.Services.Quizzes.DTOs;

public class SubmitQuizRequest
{
    public int EnrollmentId { get; set; }
    public IEnumerable<QuizAnswerRequest> Answers { get; set; } = [];
}

public class QuizAnswerRequest
{
    public int QuestionId { get; set; }
    public int AnswerId { get; set; }
}
