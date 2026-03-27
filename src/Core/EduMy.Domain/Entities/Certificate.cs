using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

public class Certificate : BaseEntity<int>
{
    public int EnrollmentId { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public string? CertificateUrl { get; set; }
    public string VerificationCode { get; set; } = string.Empty;

    public Enrollment Enrollment { get; set; } = null!;
}
