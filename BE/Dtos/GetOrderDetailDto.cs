namespace BE.Dtos;

public record GetOrderDetailDto(
    int productId,
    string productName,
    string imageUrl,
    int quantity,
    decimal unitPrice,
    bool isReviewed
);
