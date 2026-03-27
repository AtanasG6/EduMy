namespace EduMy.Application.Services.Quizzes.DTOs;

public class QuizDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PassingScore { get; set; }
    public IEnumerable<QuestionDto> Questions { get; set; } = [];
}
