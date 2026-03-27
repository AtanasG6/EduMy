using EduMy.Domain.Entities.Enrollments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduMy.Infrastructure.Persistence.Configurations.Enrollments;

public class LectureProgressConfiguration : IEntityTypeConfiguration<LectureProgress>
{
    public void Configure(EntityTypeBuilder<LectureProgress> builder)
    {
        builder.HasKey(lp => lp.Id);

        builder.HasOne(lp => lp.Enrollment)
            .WithMany(e => e.LectureProgresses)
            .HasForeignKey(lp => lp.EnrollmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(lp => lp.Lecture)
            .WithMany(l => l.LectureProgresses)
            .HasForeignKey(lp => lp.LectureId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
