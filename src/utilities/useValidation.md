# ✅ All Validators with Examples - `useValidation`

## 📋 List of Validators

| Validator         | Description                                   |
|------------------|-----------------------------------------------|
| `required()`      | Checks if the field is not empty               |
| `string()`        | Validates if value is a string                 |
| `number()`        | Validates if value is numeric                  |
| `integer()`       | Validates if value is an integer               |
| `float()`         | Validates if value is a float number           |
| `email()`         | Validates if value is a valid email            |
| `sameAs()`        | Compares value with another field              |
| `isObject()`      | Checks if value is a non-null object           |
| `isArray()`       | Checks if value is a non-empty array           |
| `foreignKey()`    | Ensures value is not 0, null, or undefined     |
| `min(val)`        | Checks if value/length >= `val`               |
| `max(val)`        | Checks if value/length <= `val`               |
| `between(min, max)`| Checks if value/length is between min and max |
| `inList(list)`    | Checks if value is in a predefined list        |
| `url()`           | Validates URL format                          |
| `alphaOnly()`     | Allows only alphabetic characters              |
| `alphanumeric()`  | Allows only letters and numbers                |
| `noWhitespace()`  | Disallows whitespace                          |
| `regex()`         | Validates against custom regex pattern         |
| `date()`          | Checks if value is a valid date                |
| `afterDate()`     | Checks if date is after a specific date        |
| `custom()`        | Custom validation function                     |

---

## 🧪 `required()`
```ts
const { validate, required } = useValidation();
const data = { name: "" };
const result = validate(data, [{ field: "name", rules: [required()] }]);
```

## 🧪 `string()`
```ts
const { validate, string } = useValidation();
const data = { title: 123 };
const result = validate(data, [{ field: "title", rules: [string()] }]);
```

## 🧪 `number()`
```ts
const { validate, number } = useValidation();
const data = { age: "25" };
const result = validate(data, [{ field: "age", rules: [number()] }]);
```

## 🧪 `integer()`
```ts
const { validate, integer } = useValidation();
const data = { count: 5.5 };
const result = validate(data, [{ field: "count", rules: [integer()] }]);
```

## 🧪 `float()`
```ts
const { validate, float } = useValidation();
const data = { price: "20.55" };
const result = validate(data, [{ field: "price", rules: [float()] }]);
```

## 🧪 `email()`
```ts
const { validate, email } = useValidation();
const data = { email: "invalid@" };
const result = validate(data, [{ field: "email", rules: [email()] }]);
```

## 🧪 `sameAs()`
```ts
const { validate, sameAs } = useValidation();
const data = { password: "123", confirm: "1234" };
const result = validate(data, [{ field: "confirm", rules: [sameAs({ field: "password" })] }]);
```

## 🧪 `isObject()`
```ts
const { validate, isObject } = useValidation();
const data = { user: null };
const result = validate(data, [{ field: "user", rules: [isObject()] }]);
```

## 🧪 `isArray()`
```ts
const { validate, isArray } = useValidation();
const data = { items: [] };
const result = validate(data, [{ field: "items", rules: [isArray()] }]);
```

## 🧪 `foreignKey()`
```ts
const { validate, foreignKey } = useValidation();
const data = { categoryId: 0 };
const result = validate(data, [{ field: "categoryId", rules: [foreignKey()] }]);
```

## 🧪 `min(val)`
```ts
const { validate, min } = useValidation();
const data = { username: "aa" };
const result = validate(data, [{ field: "username", rules: [min(3)] }]);
```

## 🧪 `max(val)`
```ts
const { validate, max } = useValidation();
const data = { username: "abcdefghijklmnop" };
const result = validate(data, [{ field: "username", rules: [max(10)] }]);
```

## 🧪 `between(min, max)`
```ts
const { validate, between } = useValidation();
const data = { age: 25 };
const result = validate(data, [{ field: "age", rules: [between(18, 24)] }]);
```

## 🧪 `inList(list)`
```ts
const { validate, inList } = useValidation();
const data = { role: "guest" };
const result = validate(data, [{ field: "role", rules: [inList(["admin", "user"]) ] }]);
```

## 🧪 `url()`
```ts
const { validate, url } = useValidation();
const data = { website: "example" };
const result = validate(data, [{ field: "website", rules: [url()] }]);
```

## 🧪 `alphaOnly()`
```ts
const { validate, alphaOnly } = useValidation();
const data = { name: "Ali123" };
const result = validate(data, [{ field: "name", rules: [alphaOnly()] }]);
```

## 🧪 `alphanumeric()`
```ts
const { validate, alphanumeric } = useValidation();
const data = { username: "Ali@2024" };
const result = validate(data, [{ field: "username", rules: [alphanumeric()] }]);
```

## 🧪 `noWhitespace()`
```ts
const { validate, noWhitespace } = useValidation();
const data = { username: "ali user" };
const result = validate(data, [{ field: "username", rules: [noWhitespace()] }]);
```

## 🧪 `regex(pattern)`
```ts
const { validate, regex } = useValidation();
const data = { code: "abc" };
const result = validate(data, [{ field: "code", rules: [regex(/^\d+$/)] }]);
```

## 🧪 `date()`
```ts
const { validate, date } = useValidation();
const data = { birthdate: "invalid-date" };
const result = validate(data, [{ field: "birthdate", rules: [date()] }]);
```

## 🧪 `afterDate(date)`
```ts
const { validate, afterDate } = useValidation();
const data = { startDate: "2010-01-01" };
const result = validate(data, [{ field: "startDate", rules: [afterDate("2020-01-01")] }]);
```

## 🧪 `custom(fn, { message })`
```ts
const { validate, custom } = useValidation();
const data = { score: 3 };
const result = validate(data, [{
  field: "score",
  rules: [custom(v => v > 5, { message: "يجب أن تكون الدرجة أكبر من 5" })]
}]);
```
## 🧪 `custom(fn, { message })` - Minimum String Length
```ts
const { validate, custom } = useValidation();
const data = { username: "abc" };
const result = validate(data, [{
  field: "username",
  rules: [custom(v => v.length >= 5, { message: "اسم المستخدم يجب أن يتكون من 5 أحرف على الأقل" })]
}]);
// result will contain an error message for the 'username' field
```
## 🧪 `custom(fn, { message })` - Value in Set
```ts
const { validate, custom } = useValidation();
const allowedColors = ["red", "green", "blue"];
const data = { colorChoice: "yellow" };
const result = validate(data, [{
  field: " colorChoice",
  rules: [custom(v => allowedColors.includes(v), { message: "اللون المختار غير صالح" })]
}]);
// result will contain an error message for the ' colorChoice' field.
```

## 🧪 `custom(fn, { message })` - Value in Set
```ts
const { validate, custom } = useValidation();
const allowedColors = ["red", "green", "blue"];
const data = { colorChoice: "yellow" };
const result = validate(data, [{
  field: " colorChoice",
  rules: [custom(v => allowedColors.includes(v), { message: "اللون المختار غير صالح" })]
}]);
// result will contain an error message for the ' colorChoice' field.
```

## 🧪 `custom(fn, { message })` - Value in Set
```ts
const { validate, custom } = useValidation();
const allowedColors = ["red", "green", "blue"];
const data = { colorChoice: "yellow" };
const result = validate(data, [{
  field: " colorChoice",
  rules: [custom(v => allowedColors.includes(v), { message: "اللون المختار غير صالح" })]
}]);
// result will contain an error message for the ' colorChoice' field.
```
## 🧪 `custom(fn, { message })` - Future Date Check
```ts
const { validate, custom } = useValidation();
const data = { eventDate: "2023-01-01" }; // Assuming today is after this date
const result = validate(data, [{
  field: "eventDate",
  rules: [custom(v => new Date(v) > new Date(), { message: "تاريخ الحدث يجب أن يكون في المستقبل" })]
}]);
// result will contain an error message for the 'eventDate' field.