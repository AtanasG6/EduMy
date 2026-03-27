using EduMy.Domain.Common;
using EduMy.Domain.Enums;

namespace EduMy.Domain.Entities;

public class Question : BaseEntity<int>
{
    public int QuizId { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int Points { get; set; }
    public int OrderIndex { get; set; }

    public Quiz Quiz { get; set; } = null!;
    public ICollection<Answer> Answers { get; set; } = [];
}
