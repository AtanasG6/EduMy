using EduMy.Domain.Common;

namespace EduMy.Domain.Entities.Quizzes;

public class Answer : BaseEntity<int>
{
    public int QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int OrderIndex { get; set; }

    public Question Question { get; set; } = null!;
}
