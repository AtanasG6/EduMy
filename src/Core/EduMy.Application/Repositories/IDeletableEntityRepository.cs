using System.Linq.Expressions;
using EduMy.Domain.Common;

namespace EduMy.Application.Repositories;

public interface IDeletableEntityRepository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : BaseDeletableEntity<TId>
{
    Task<List<TEntity>> GetAllWithDeletedAsync();
    Task<TEntity?> FindWithDeletedAsync(Expression<Func<TEntity, bool>> predicate);
    void SoftDelete(TEntity entity);
    void Restore(TEntity entity);
}
