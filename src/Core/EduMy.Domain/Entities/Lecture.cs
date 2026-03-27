using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

public class Lecture : BaseEntity<int>
{
    public int ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? DocumentUrl { get; set; }
    public int? DurationMinutes { get; set; }

    public Module Module { get; set; } = null!;
    public ICollection<LectureProgress> LectureProgresses { get; set; } = [];
}
