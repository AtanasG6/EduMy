namespace EduMy.Application.Services.Quizzes.DTOs;

public class AnswerDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}
