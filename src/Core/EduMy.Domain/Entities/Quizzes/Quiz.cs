using EduMy.Domain.Common;
using EduMy.Domain.Entities.Courses;

namespace EduMy.Domain.Entities.Quizzes;

public class Quiz : BaseEntity<int>
{
    public int ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PassingScore { get; set; }
    public int OrderIndex { get; set; }

    public Module Module { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = [];
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
}
