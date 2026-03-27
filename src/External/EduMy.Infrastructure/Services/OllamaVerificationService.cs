using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using EduMy.Application.Services.Diplomas.Interfaces;

namespace EduMy.Infrastructure.Services;

public class OllamaVerificationService : IDiplomaVerificationService
{
    private readonly HttpClient _http;

    public OllamaVerificationService(HttpClient http)
    {
        _http = http;
    }

    public async Task<DiplomaVerificationResult> VerifyAsync(Stream imageStream)
    {
        using var ms = new MemoryStream();
        await imageStream.CopyToAsync(ms);
        var base64 = Convert.ToBase64String(ms.ToArray());

        var payload = new
        {
            model = "llama3.2-vision:latest",
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = "Does this image show a diploma, university degree, or academic certificate? Reply with only YES or NO.",
                    images = new[] { base64 }
                }
            },
            stream = false
        };

        HttpResponseMessage response;
        try
        {
            response = await _http.PostAsJsonAsync("api/chat", payload);
        }
        catch
        {
            return new DiplomaVerificationResult { IsValid = false, Message = "Verification service unavailable." };
        }

        if (!response.IsSuccessStatusCode)
            return new DiplomaVerificationResult { IsValid = false, Message = "Verification service returned an error." };

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<OllamaChatResponse>(json);
        var answer = result?.Message?.Content?.Trim() ?? "";

        bool isValid = answer.StartsWith("YES", StringComparison.OrdinalIgnoreCase);

        return new DiplomaVerificationResult
        {
            IsValid = isValid,
            Message = isValid
                ? "Diploma verified successfully."
                : "Could not verify diploma. Please upload a clear image of your diploma or certificate."
        };
    }
}

file class OllamaChatResponse
{
    [JsonPropertyName("message")]
    public OllamaMessage? Message { get; set; }
}

file class OllamaMessage
{
    [JsonPropertyName("content")]
    public string? Content { get; set; }
}
