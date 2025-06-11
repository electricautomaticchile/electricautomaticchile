// Test de utilidades de validación
describe("Validation Utils", () => {
  describe("validateClientNumber", () => {
    const validateClientNumber = (value: string) => {
      const regex = /^\d{6}-\d$/;
      return regex.test(value);
    };

    it("validates correct client number format", () => {
      expect(validateClientNumber("123456-7")).toBe(true);
      expect(validateClientNumber("999999-1")).toBe(true);
      expect(validateClientNumber("000000-0")).toBe(true);
    });

    it("rejects invalid client number formats", () => {
      expect(validateClientNumber("12345-7")).toBe(false); // muy corto
      expect(validateClientNumber("1234567-7")).toBe(false); // muy largo
      expect(validateClientNumber("123456-77")).toBe(false); // dígito verificador largo
      expect(validateClientNumber("123456")).toBe(false); // sin guión
      expect(validateClientNumber("abcdef-7")).toBe(false); // letras
      expect(validateClientNumber("123456-a")).toBe(false); // letra en dígito verificador
      expect(validateClientNumber("")).toBe(false); // vacío
    });
  });

  describe("validateEmail", () => {
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it("validates correct email formats", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("admin+tag@company.org")).toBe(true);
    });

    it("rejects invalid email formats", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("user@domain")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("user name@domain.com")).toBe(false); // espacios
    });
  });

  describe("validatePassword", () => {
    const validatePassword = (password: string) => {
      // Al menos 8 caracteres, una mayúscula, una minúscula, un número
      const minLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);

      return minLength && hasUpperCase && hasLowerCase && hasNumber;
    };

    it("validates strong passwords", () => {
      expect(validatePassword("Password123")).toBe(true);
      expect(validatePassword("MySecure123")).toBe(true);
      expect(validatePassword("Test1234")).toBe(true);
    });

    it("rejects weak passwords", () => {
      expect(validatePassword("short")).toBe(false); // muy corta
      expect(validatePassword("password")).toBe(false); // sin mayúscula ni número
      expect(validatePassword("PASSWORD123")).toBe(false); // sin minúscula
      expect(validatePassword("Password")).toBe(false); // sin número
      expect(validatePassword("password123")).toBe(false); // sin mayúscula
      expect(validatePassword("")).toBe(false); // vacía
    });
  });

  describe("validatePhone", () => {
    const validatePhone = (phone: string) => {
      // Formato chileno: +56 9 1234 5678 o 9 1234 5678
      const regex = /^(\+56\s?)?[9]\s?\d{4}\s?\d{4}$/;
      return regex.test(phone.replace(/\s/g, ""));
    };

    it("validates correct Chilean phone formats", () => {
      expect(validatePhone("+56912345678")).toBe(true);
      expect(validatePhone("912345678")).toBe(true);
      expect(validatePhone("+56 9 1234 5678")).toBe(true);
      expect(validatePhone("9 1234 5678")).toBe(true);
    });

    it("rejects invalid phone formats", () => {
      expect(validatePhone("812345678")).toBe(false); // no empieza con 9
      expect(validatePhone("91234567")).toBe(false); // muy corto
      expect(validatePhone("9123456789")).toBe(false); // muy largo
      expect(validatePhone("+57912345678")).toBe(false); // código de país incorrecto
      expect(validatePhone("")).toBe(false); // vacío
    });
  });

  describe("sanitizeInput", () => {
    const sanitizeInput = (input: string) => {
      return input
        .trim()
        .replace(/[<>]/g, "") // remover caracteres peligrosos
        .substring(0, 1000); // limitar longitud
    };

    it("sanitizes dangerous input", () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput("  spaced input  ")).toBe("spaced input");
      expect(sanitizeInput("normal input")).toBe("normal input");
    });

    it("limits input length", () => {
      const longInput = "a".repeat(2000);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized.length).toBe(1000);
    });
  });

  describe("validateRUT", () => {
    const validateRUT = (rut: string) => {
      // Validación básica de RUT chileno
      const cleanRUT = rut.replace(/[^\dkK]/g, "");
      if (cleanRUT.length < 8 || cleanRUT.length > 9) return false;

      const body = cleanRUT.slice(0, -1);
      const dv = cleanRUT.slice(-1).toUpperCase();

      let sum = 0;
      let multiplier = 2;

      for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }

      const expectedDV = 11 - (sum % 11);
      const calculatedDV =
        expectedDV === 11
          ? "0"
          : expectedDV === 10
          ? "K"
          : expectedDV.toString();

      return dv === calculatedDV;
    };

    it("validates correct RUT formats", () => {
      expect(validateRUT("12345678-5")).toBe(true);
      expect(validateRUT("12.345.678-5")).toBe(true);
      expect(validateRUT("12345678-K")).toBe(false); // DV incorrecto para este número
    });

    it("rejects invalid RUT formats", () => {
      expect(validateRUT("1234567")).toBe(false); // muy corto
      expect(validateRUT("123456789012")).toBe(false); // muy largo
      expect(validateRUT("abcdefgh-5")).toBe(false); // letras en número
      expect(validateRUT("")).toBe(false); // vacío
    });
  });
});
