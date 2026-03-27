using EduMy.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduMy.Infrastructure.Persistence.Configurations.Quizzes;

public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
{
    public void Configure(EntityTypeBuilder<Quiz> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title).IsRequired().HasMaxLength(200);

        builder.HasOne(q => q.Module)
            .WithOne(m => m.Quiz)
            .HasForeignKey<Quiz>(q => q.ModuleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
