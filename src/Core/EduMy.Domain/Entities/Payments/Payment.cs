using EduMy.Domain.Common;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Enums;

namespace EduMy.Domain.Entities.Payments;

public class Payment : BaseEntity<int>
{
    public int EnrollmentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public Enrollment Enrollment { get; set; } = null!;
}
