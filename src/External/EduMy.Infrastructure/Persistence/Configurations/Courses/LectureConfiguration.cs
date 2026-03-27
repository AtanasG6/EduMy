using EduMy.Domain.Entities.Courses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduMy.Infrastructure.Persistence.Configurations.Courses;

public class LectureConfiguration : IEntityTypeConfiguration<Lecture>
{
    public void Configure(EntityTypeBuilder<Lecture> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title).IsRequired().HasMaxLength(200);
        builder.Property(l => l.VideoUrl).HasMaxLength(500);
        builder.Property(l => l.DocumentUrl).HasMaxLength(500);

        builder.HasOne(l => l.Module)
            .WithMany(m => m.Lectures)
            .HasForeignKey(l => l.ModuleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
