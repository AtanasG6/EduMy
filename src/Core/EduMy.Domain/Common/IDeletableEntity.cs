namespace EduMy.Domain.Common;

public interface IDeletableEntity
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}
