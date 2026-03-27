namespace EduMy.Application.Services.Quizzes.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Points { get; set; }
    public int OrderIndex { get; set; }
    public IEnumerable<AnswerDto> Answers { get; set; } = [];
}
