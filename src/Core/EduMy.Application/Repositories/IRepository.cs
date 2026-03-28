using System.Linq.Expressions;
using EduMy.Domain.Common;

namespace EduMy.Application.Repositories;

public interface IRepository<TEntity, TId> where TEntity : BaseEntity<TId>
{
    Task<TEntity?> GetByIdAsync(TId id);
    Task<TEntity?> GetByIdAsync(TId id, params string[] includes);
    Task<List<TEntity>> GetAllAsync();
    Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate, params string[] includes);
    Task<List<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> predicate);
    Task<List<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> predicate, params string[] includes);
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null);
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    Task<int> SaveChangesAsync();
}
