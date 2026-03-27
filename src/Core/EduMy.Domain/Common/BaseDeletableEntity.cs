namespace EduMy.Domain.Common;

public abstract class BaseDeletableEntity<TId> : BaseEntity<TId>, IDeletableEntity, IAuditableEntity
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
