using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Payments;
using EduMy.Domain.Entities.Quizzes;
using EduMy.Domain.Entities.Reviews;
using EduMy.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace EduMy.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Lecture> Lectures => Set<Lecture>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<LectureProgress> LectureProgresses => Set<LectureProgress>();
    public DbSet<Certificate> Certificates => Set<Certificate>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
