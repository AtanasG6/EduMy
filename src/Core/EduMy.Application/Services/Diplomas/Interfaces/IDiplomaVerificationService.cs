namespace EduMy.Application.Services.Diplomas.Interfaces;

public interface IDiplomaVerificationService
{
    Task<DiplomaVerificationResult> VerifyAsync(Stream imageStream);
}

public class DiplomaVerificationResult
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
}
