using EduMy.Application.Common;
using EduMy.Application.Services.Diplomas.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class DiplomaController : BaseApiController
{
    private readonly IDiplomaVerificationService _verification;

    public DiplomaController(IDiplomaVerificationService verification)
    {
        _verification = verification;
    }

    [HttpPost("verify")]
    public async Task<ActionResult<ApiResponse<DiplomaVerificationResult>>> Verify(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse.Fail("No file uploaded."));

        using var stream = file.OpenReadStream();
        var result = await _verification.VerifyAsync(stream);

        return Ok(ApiResponse<DiplomaVerificationResult>.Ok(result));
    }
}
