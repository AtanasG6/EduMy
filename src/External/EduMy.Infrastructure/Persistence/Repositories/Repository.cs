using System.Linq.Expressions;
using EduMy.Application.Repositories;
using EduMy.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace EduMy.Infrastructure.Persistence.Repositories;

public class Repository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : BaseEntity<TId>
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<TEntity> DbSet;

    public Repository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<TEntity>();
    }

    public async Task<TEntity?> GetByIdAsync(TId id)
        => await DbSet.FindAsync(id);

    public async Task<List<TEntity>> GetAllAsync()
        => await DbSet.ToListAsync();

    public async Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate)
        => await DbSet.FirstOrDefaultAsync(predicate);

    public async Task<List<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> predicate)
        => await DbSet.Where(predicate).ToListAsync();

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        => await DbSet.AnyAsync(predicate);

    public async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
        => predicate is null
            ? await DbSet.CountAsync()
            : await DbSet.CountAsync(predicate);

    public async Task AddAsync(TEntity entity)
        => await DbSet.AddAsync(entity);

    public void Update(TEntity entity)
        => DbSet.Update(entity);

    public void Delete(TEntity entity)
        => DbSet.Remove(entity);

    public async Task<int> SaveChangesAsync()
        => await Context.SaveChangesAsync();
}
