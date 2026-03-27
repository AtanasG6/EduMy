using System.Linq.Expressions;
using EduMy.Application.Repositories;
using EduMy.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace EduMy.Infrastructure.Persistence.Repositories;

public class DeletableEntityRepository<TEntity, TId>
    : Repository<TEntity, TId>, IDeletableEntityRepository<TEntity, TId>
    where TEntity : BaseDeletableEntity<TId>
{
    public DeletableEntityRepository(AppDbContext context) : base(context) { }

    public async Task<List<TEntity>> GetAllWithDeletedAsync()
        => await DbSet.IgnoreQueryFilters().ToListAsync();

    public async Task<TEntity?> FindWithDeletedAsync(Expression<Func<TEntity, bool>> predicate)
        => await DbSet.IgnoreQueryFilters().FirstOrDefaultAsync(predicate);

    public void SoftDelete(TEntity entity)
    {
        entity.IsDeleted = true;
        entity.DeletedAt = DateTime.UtcNow;
        DbSet.Update(entity);
    }

    public void Restore(TEntity entity)
    {
        entity.IsDeleted = false;
        entity.DeletedAt = null;
        DbSet.Update(entity);
    }
}
