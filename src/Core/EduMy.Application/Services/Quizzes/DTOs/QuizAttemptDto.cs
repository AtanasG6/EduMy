namespace EduMy.Application.Services.Quizzes.DTOs;

public class QuizAttemptDto
{
    public int Id { get; set; }
    public int Score { get; set; }
    public bool IsPassed { get; set; }
    public DateTime AttemptedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
