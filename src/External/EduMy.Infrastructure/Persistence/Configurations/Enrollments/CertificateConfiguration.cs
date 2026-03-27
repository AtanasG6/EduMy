using EduMy.Domain.Entities.Enrollments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduMy.Infrastructure.Persistence.Configurations.Enrollments;

public class CertificateConfiguration : IEntityTypeConfiguration<Certificate>
{
    public void Configure(EntityTypeBuilder<Certificate> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasIndex(c => c.EnrollmentId).IsUnique();
        builder.HasIndex(c => c.CertificateNumber).IsUnique();

        builder.Property(c => c.CertificateNumber).IsRequired().HasMaxLength(100);
        builder.Property(c => c.CertificateUrl).HasMaxLength(500);
        builder.Property(c => c.VerificationCode).IsRequired().HasMaxLength(50);

        builder.HasOne(c => c.Enrollment)
            .WithOne(e => e.Certificate)
            .HasForeignKey<Certificate>(c => c.EnrollmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
