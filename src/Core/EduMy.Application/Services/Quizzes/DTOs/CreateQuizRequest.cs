namespace EduMy.Application.Services.Quizzes.DTOs;

public class CreateQuizRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PassingScore { get; set; } = 70;
}

public class CreateQuestionRequest
{
    public string Text { get; set; } = string.Empty;
    public int Points { get; set; } = 1;
    public IEnumerable<CreateAnswerRequest> Answers { get; set; } = [];
}

public class CreateAnswerRequest
{
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
