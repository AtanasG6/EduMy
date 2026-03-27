using EduMy.Domain.Common;

namespace EduMy.Application.Repositories;

public interface IDeletableEntityRepository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : BaseDeletableEntity<TId>
{
    IQueryable<TEntity> AllWithDeleted();
    void SoftDelete(TEntity entity);
    void Restore(TEntity entity);
}
