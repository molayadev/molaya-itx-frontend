import { ConsoleLogger } from "./ConsoleLogger";

describe("ConsoleLogger", () => {
  let logger: ConsoleLogger;
  let consoleSpies: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleSpies = {
      debug: jest.spyOn(console, "debug").mockImplementation(),
      info: jest.spyOn(console, "info").mockImplementation(),
      warn: jest.spyOn(console, "warn").mockImplementation(),
      error: jest.spyOn(console, "error").mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const parametrizedTestsLoggerLevels = [
    {
      method: "debug" as const,
      level: "DEBUG",
      color: "color: gray",
      message: "Debug message",
    },
    {
      method: "info" as const,
      level: "INFO",
      color: "color: #007acc",
      message: "Info message",
    },
    {
      method: "warn" as const,
      level: "WARN",
      color: "color: orange",
      message: "Warning message",
    },
    {
      method: "error" as const,
      level: "ERROR",
      color: "color: red",
      message: "Error message",
    },
  ];
  describe.each(parametrizedTestsLoggerLevels)(
    "$method method",
    ({ method, level, color, message }) => {
      it("should call console.$method with formatted message", () => {
        logger[method]({ message });

        expect(consoleSpies[method]).toHaveBeenCalledWith(
          `%c[${level}] ${message}`,
          color,
          ""
        );
      });

      it("should call console.$method with message and context", () => {
        const context = { key: "value", num: 123 };
        logger[method]({ message, context });

        expect(consoleSpies[method]).toHaveBeenCalledWith(
          `%c[${level}] ${message}`,
          color,
          context
        );
      });
    }
  );
});
