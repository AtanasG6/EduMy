using EduMy.Domain.Common;

namespace EduMy.Application.Repositories;

public interface IRepository<TEntity, TId> where TEntity : BaseEntity<TId>
{
    Task<TEntity?> GetByIdAsync(TId id);
    IQueryable<TEntity> All();
    IQueryable<TEntity> AllAsNoTracking();
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    Task<int> SaveChangesAsync();
}
