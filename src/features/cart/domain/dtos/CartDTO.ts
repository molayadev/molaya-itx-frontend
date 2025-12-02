export interface AddToCartRequestDTO {
  id: string;
  colorCode: number;
  storageCode: number;
}

export interface AddToCartResponseDTO {
  count: number;
}
