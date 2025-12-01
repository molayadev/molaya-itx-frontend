import { HttpError } from "./HttpError";

describe("HttpError", () => {
  describe("constructor", () => {
    it("should create error with correct properties", () => {
      const error = new HttpError(404, "Not Found", "https://api.example.com/products");

      expect(error.statusCode).toBe(404);
      expect(error.statusText).toBe("Not Found");
      expect(error.url).toBe("https://api.example.com/products");
      expect(error.name).toBe("HttpError");
    });

    it("should create error message with all details", () => {
      const error = new HttpError(500, "Internal Server Error", "https://api.example.com/users");

      expect(error.message).toBe(
        "HTTP 500: Internal Server Error (https://api.example.com/users)"
      );
    });

    it("should be instanceof Error", () => {
      const error = new HttpError(400, "Bad Request", "/api/products");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
    });

    it("should have stack trace", () => {
      const error = new HttpError(403, "Forbidden", "/api/admin");

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("HttpError");
    });
  });

  describe("isClientError", () => {
    it.each([
      [400, true],
      [401, true],
      [403, true],
      [404, true],
      [422, true],
      [499, true],
    ])("should return %s for status code %d", (statusCode, expected) => {
      const error = new HttpError(statusCode, "Error", "/api/test");
      expect(error.isClientError).toBe(expected);
    });

    it.each([
      [200, false],
      [300, false],
      [399, false],
      [500, false],
      [503, false],
    ])("should return %s for status code %d", (statusCode, expected) => {
      const error = new HttpError(statusCode, "Error", "/api/test");
      expect(error.isClientError).toBe(expected);
    });
  });

  describe("isServerError", () => {
    it.each([
      [500, true],
      [501, true],
      [502, true],
      [503, true],
      [504, true],
      [599, true],
    ])("should return %s for status code %d", (statusCode, expected) => {
      const error = new HttpError(statusCode, "Error", "/api/test");
      expect(error.isServerError).toBe(expected);
    });

    it.each([
      [200, false],
      [300, false],
      [400, false],
      [499, false],
    ])("should return %s for status code %d", (statusCode, expected) => {
      const error = new HttpError(statusCode, "Error", "/api/test");
      expect(error.isServerError).toBe(expected);
    });
  });
});
