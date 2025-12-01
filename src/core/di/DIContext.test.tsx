import React from "react";
import { render, screen } from "@testing-library/react";
import { DIProvider, useDependency } from "./DIContext";

interface MockServices {
  productRepository: {
    findAll: () => Promise<string[]>;
  };
  userService: {
    getCurrentUser: () => string;
  };
}

describe("DIContext", () => {
  describe("useDependency", () => {
    it("should throw error when used outside DIProvider", () => {
      const TestComponent = () => {
        useDependency<MockServices>();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useDependency must be used within DIProvider"
      );
    });

    it("should return services when used inside DIProvider", () => {
      const mockServices: MockServices = {
        productRepository: {
          findAll: jest.fn().mockResolvedValue(["Product 1", "Product 2"]),
        },
        userService: {
          getCurrentUser: jest.fn().mockReturnValue("John Doe"),
        },
      };

      const TestComponent = () => {
        const services = useDependency<MockServices>();
        return (
          <div>
            <span data-testid="user">{services.userService.getCurrentUser()}</span>
          </div>
        );
      };

      render(
        <DIProvider services={mockServices}>
          <TestComponent />
        </DIProvider>
      );

      expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    });

    it("should provide correct services to nested components", () => {
      const mockServices = {
        value: "test-value",
        count: 42,
      };

      const NestedComponent = () => {
        const services = useDependency<typeof mockServices>();
        return (
          <div>
            <span data-testid="value">{services.value}</span>
            <span data-testid="count">{services.count}</span>
          </div>
        );
      };

      const ParentComponent = () => (
        <div>
          <NestedComponent />
        </div>
      );

      render(
        <DIProvider services={mockServices}>
          <ParentComponent />
        </DIProvider>
      );

      expect(screen.getByTestId("value")).toHaveTextContent("test-value");
      expect(screen.getByTestId("count")).toHaveTextContent("42");
    });
  });

  describe("DIProvider", () => {
    it("should render children correctly", () => {
      const mockServices = { test: "service" };

      render(
        <DIProvider services={mockServices}>
          <div data-testid="child">Child Component</div>
        </DIProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Child Component");
    });

    it("should provide different services to different provider instances", () => {
      const services1 = { name: "Service 1" };
      const services2 = { name: "Service 2" };

      const Consumer = ({ testId }: { testId: string }) => {
        const services = useDependency<{ name: string }>();
        return <span data-testid={testId}>{services.name}</span>;
      };

      render(
            <div>
                <DIProvider services={services1}>
                    <Consumer testId="consumer1" />
                </DIProvider>
                <DIProvider services={services2}>
                    <Consumer testId="consumer2" />
                </DIProvider>
            </div>
        );

      expect(screen.getByTestId("consumer1")).toHaveTextContent("Service 1");
      expect(screen.getByTestId("consumer2")).toHaveTextContent("Service 2");
    });

    it("should handle complex service objects", () => {
      const complexServices = {
        api: {
          baseUrl: "https://api.example.com",
          timeout: 5000,
        },
        cache: {
          enabled: true,
          ttl: 3600,
        },
        logger: {
          level: "debug",
          output: "console",
        },
      };

      const TestComponent = () => {
        const services = useDependency<typeof complexServices>();
        return (
          <div>
            <span data-testid="url">{services.api.baseUrl}</span>
            <span data-testid="cache">{services.cache.enabled.toString()}</span>
          </div>
        );
      };

      render(
        <DIProvider services={complexServices}>
          <TestComponent />
        </DIProvider>
      );

      expect(screen.getByTestId("url")).toHaveTextContent(
        "https://api.example.com"
      );
      expect(screen.getByTestId("cache")).toHaveTextContent("true");
    });
  });

  describe("Type Safety", () => {
    it("should maintain type safety with generic parameter", () => {
      interface TypedServices {
        getValue: () => number;
      }

      const services: TypedServices = {
        getValue: () => 123,
      };

      const TypedComponent = () => {
        const deps = useDependency<TypedServices>();
        const value = deps.getValue();
        return <div data-testid="typed-value">{value}</div>;
      };

      render(
        <DIProvider services={services}>
          <TypedComponent />
        </DIProvider>
      );

      expect(screen.getByTestId("typed-value")).toHaveTextContent("123");
    });
  });
});
